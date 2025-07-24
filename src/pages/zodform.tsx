import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addNewCardFormValues, addNewCardSchema } from "@/pages/modals/addNewCardModal-schema";

export const ZodForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<addNewCardFormValues>({
    resolver: zodResolver(addNewCardSchema),
  })
  const onSubmit = (data: addNewCardFormValues) => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("answer")} />
      <p>{errors.answer?.message}</p>

      <input {...register("question")} />
      <p>{errors.question?.message}</p>

      <input type="submit" />
    </form>
  )
}