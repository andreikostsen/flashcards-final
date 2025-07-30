import { Typography } from "@/components/ui/typography";
import s from "@/pages/modals/addNewDeckModal.module.scss";
import CloseCrossOutline from "@/assets/icons/components/Close";
import { Button } from "@/components/ui/button";
import { Image } from "@/assets/icons/components";
import { ChangeEvent, useEffect, useState } from "react";


type PropsType = {
  id: string;
  errors: any;
  cover?: string
  setValue: any,
  trigger: any,
  coverFromInput: (cover:File | string)=>void;
}


export const ImageInput = ({ setValue, trigger, id, errors, ...props }:PropsType) => {

  useEffect(() => {
    setCoverURL(props.cover);
  }, [props.cover]);

  const [cover, setCover] = useState<File | string>('');
  const [coverURL, setCoverURL] = useState<string | undefined>();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCover(e.target.files?.[0]);
      setCoverURL(URL.createObjectURL(e.target.files?.[0]));
      setValue('addDeckCoverInput', e.target.files?.[0])
      trigger('addDeckCoverInput')
      props.coverFromInput(e.target.files?.[0])
    }
  }

  const onDeleteImageHandler = () => {
    if (coverURL != null) {
      URL.revokeObjectURL(coverURL);
    }
    setCover("");
    setCoverURL(undefined);
  }

  return (
    <>
      <div>
        <input
          id={id}
          onChange={onFileChange}
          style={{ display: "none" }}
          type="file"
        />
      </div>
      {
        errors.addDeckCoverInput && (
          <Typography variant="error">
            <>{errors.addDeckCoverInput.message}</>
          </Typography>
        )
      }
      {
        coverURL && (
          <div className={s.coverImage}>
            <img alt={name} src={coverURL} width={"170px"} />
            <button className={s.iconButton} onClick={onDeleteImageHandler}>
              <CloseCrossOutline />
            </button>
          </div>
        )
      }
      <Button as={"label"} fullWidth htmlFor={id} variant={"secondary"}>
        <Image width={"1rem"} /> {coverURL ? "Change Image" : "Upload Image"}
      </Button>
    </>
  )
}