import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LogOut } from "@/assets/icons/components";
import Edit2Outline from "@/assets/icons/components/Edit2Outline";
import { SvgWrapper } from "@/assets/icons/wrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ControlledTextField } from "@/components/ui/controlled/controlled-textfield/controlled-textfield";
import { Header } from "@/components/ui/header";
import { Typography } from "@/components/ui/typography";
import { useAuthMeQuery, useUpdateUserMutation } from "@/services/auth/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";

import s from "./profile.module.scss";

const editProfileSchema = z.object({
  avatar: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 1_000_000,
      { message: "File too big (max 1MB)" }
    )
    .refine(
      (files) => !files || files.length === 0 || files[0]?.type?.startsWith("image/"),
      { message: "Only Image files are allowed" }
    ),


  userName: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name is too long")
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val))
    .refine((val) => val === undefined || val.length > 0, {
      message: "Name cannot be empty"
    })
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>

export const Profile = () => {
  const meResponse = useAuthMeQuery();
  const [updateUser] = useUpdateUserMutation();
  const [showEditForm, setShowEditForm] = useState<boolean>(false)

  const isLoading = meResponse.isLoading || !meResponse.data;

  if (isLoading) return <div>Loading...</div>;

  const {
    control,
    register,
    setValue,
    trigger,
    handleSubmit,
    getFieldState,
    watch,
    formState: { errors, isDirty }
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      userName: meResponse.data.name
    }
  });

  const selectedFile = watch("avatar")?.[0];
  const filePreview = selectedFile ? URL.createObjectURL(selectedFile) : meResponse.data.avatar;
  const nameInitial = meResponse.data.name?.[0]?.toUpperCase() || "?";

  // const onSubmit = (data: EditProfileFormValues) => {
  //
  //   const payload: { name?: string; avatar?: File } = {};
  //
  //   if (data.userName) {
  //     payload.name = data.userName;
  //   }
  //
  //   if (data.avatar?.[0]) {
  //     payload.avatar = data.avatar[0];
  //   }
  //
  //   updateUser(payload);
  // };

  // Intercepts form submission to show alert before Zod validation
  // const onRawSubmit = (event: FormEvent<HTMLFormElement>) => {
  //
  //   debugger
  //
  //   event.preventDefault();
  //
  //   const form = event.currentTarget;
  //   const formData = new FormData(form);
  //
  //   const file = formData.get("avatar");
  //   const name = formData.get("userName");
  //
  //   const hasAvatar = file instanceof File && file.name !== "";
  //   const hasName = typeof name === "string" && name.trim() !== "";
  //
  //   if (!hasAvatar && !hasName) {
  //     alert("Please provide at least one field to update.");
  //     return;
  //   }
  //
  //   try {
  //     handleSubmit(onSubmit, (error) => {
  //       debugger
  //       console.warn("Validation error:", error);
  //     })();
  //   } catch (err) {
  //     console.error("Caught Zod error manually:", err);
  //   }
  // };

  const onSubmit = (data: EditProfileFormValues) => {
    console.log(data)
    setShowEditForm(false)
    updateUser(
      {
        avatar: data.avatar[0],
        name: data.userName
      }
      )
  }


  const avatarFieldState = getFieldState("avatar").isDirty;
  const userNameFieldState = getFieldState("userName").isDirty
  console.log(avatarFieldState)
  console.log(userNameFieldState)

  return (
    <>
      <Header isAuthenticated={!meResponse.isUninitialized} userInfo={meResponse.data} />
      <Card className={s.wrapper}>
        <Typography className={s.center} variant="h1">
          Personal Information
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={s.avatarWrapper}>
            {filePreview ? (
              <img alt="avatar" className={s.avatar} src={filePreview} />
            ) : (
              <div className={s.noImage}>
                <Typography variant="h1">{nameInitial}</Typography>
              </div>
            )}
            {/*{!errors.avatar ? (*/}
            {/*  <img alt="avatar" className={s.avatar} src={filePreview} />*/}
            {/*) : (*/}
            {/*  <div className={s.noImage}>*/}
            {/*    <Typography variant="h1">{nameInitial}</Typography>*/}
            {/*  </div>*/}
            {/*)}*/}
            <input
              type="file"
              id="avatar"
              // {...register("avatar")}
              style={{ display: "none" }}
              onChange={(e) => {
                const fileList = e.target.files;

                // Set the field value manually
                setValue("avatar", fileList);

                // Trigger validation manually
                trigger("avatar");
                setShowEditForm(true)
              }}
            />
            <label htmlFor="avatar">
              <SvgWrapper
                SvgComponent={Edit2Outline}
                size="16"
                wrapperClassName={s.editIconWrapper}
              />
            </label>
          </div>
          <p>{getFieldState("avatar").isDirty && "dirty"}</p>
          {errors.avatar && (
            <Typography variant="error" className={s.avatarError}>
              {errors.avatar.message}
            </Typography>
          )}

          {showEditForm && (
            <><ControlledTextField
              control={control}
              name="userName"
              placeholder="Name"
              wrapperProps={{ className: s.txtFieldWrapper }} /><Button
              externalClassName={s.buttonMargin}
              fullWidth
              type="submit"
              variant="primary"
            >
              Update Profile
            </Button></>)}
          {!showEditForm && (
            <Typography className={s.center} variant={"h2"}>
              {meResponse.data.name}
              <SvgWrapper
                SvgComponent={Edit2Outline}
                onClick={() => setShowEditForm(true)}
                size={"16"}
                wrapper={"button"}
                wrapperClassName={s.editIconWrapper1}
              />
            </Typography>
          )}
        </form>

        <Typography className={s.email} variant="body2">
          {meResponse.data.email}
        </Typography>
        <Button variant="secondary">
          <LogOut width="1rem" />
          Logout
        </Button>
      </Card>
    </>
  );
};
