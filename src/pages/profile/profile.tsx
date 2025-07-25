import { useState } from "react";
import { useForm } from "react-hook-form";

import { LogOut } from "@/assets/icons/components";
import Edit2Outline from "@/assets/icons/components/Edit2Outline";
import { SvgWrapper } from "@/assets/icons/wrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ControlledTextField } from "@/components/ui/controlled/controlled-textfield/controlled-textfield";
import { Header } from "@/components/ui/header";
import { Typography } from "@/components/ui/typography";
import { useAuthMeQuery, useLogoutMutation, useUpdateUserMutation } from "@/services/auth/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";

import s from "./profile.module.scss";
import { EditProfileFormValues, editProfileSchema } from "@/pages/profile/editProfile-schema";


export const Profile = () => {
  const meResponse = useAuthMeQuery();
  const [updateUser] = useUpdateUserMutation();
  const [logout] = useLogoutMutation();
  const [showEditForm, setShowEditForm] = useState<boolean>(false)

  const isLoading = meResponse.isLoading || !meResponse.data;

  if (isLoading) return <div>Loading...</div>;

  const {
    control,
    setValue,
    trigger,
    handleSubmit,
    getFieldState,
    watch,
    formState: { errors }
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      userName: meResponse.data ? meResponse.data.name : undefined,
    }
  });

  const selectedFile = watch("avatar")?.[0];
  const filePreview = selectedFile ? URL.createObjectURL(selectedFile) : meResponse.data? meResponse.data.avatar : undefined;
  const nameInitial = meResponse.data?.name?.[0]?.toUpperCase() || "?";


  const onSubmit = (data: EditProfileFormValues) => {
    console.log(data)
    setShowEditForm(false)
    updateUser(
      {
        avatar: data.avatar ? data.avatar[0] : undefined,
        name: getFieldState("userName").isDirty ? data.userName : undefined,
      }
      )
  }

  const handleLogout = async () => {
    try {
      await logout()
    }
    catch (e) {
      console.error('Logout failed:', e)
    }
  }


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
            <input
              type="file"
              id="avatar"
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
          {errors.avatar && (
            <Typography variant="error" className={s.avatarError}>
              <>{errors.avatar.message}</>
            </Typography>
          )}

          {showEditForm && (
            <><ControlledTextField
              control={control}
              name="userName"
              placeholder="Name"
              wrapperProps={{ className: s.txtFieldWrapper }}
              onBlur={()=>{setShowEditForm(false)
              console.log('blur')
              }}
            />
              <Button
              externalClassName={s.buttonMargin}
              fullWidth
              // disabled={!getFieldState("userName").isDirty}
              type="submit"
              variant="primary"
            >
              Update Profile
            </Button></>)}
          {!showEditForm && (
            <Typography className={s.center} variant={"h2"}>
              {meResponse.data ? meResponse.data.name: null}
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
          {meResponse.data ? meResponse.data.email: null}
        </Typography>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut width="1rem" />
          Logout
        </Button>
      </Card>
    </>
  );
};
