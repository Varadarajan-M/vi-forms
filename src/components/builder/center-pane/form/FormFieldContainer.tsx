import { useFormProperty } from "@/zustand/store";
import { Fragment } from "react";
import FieldRenderer from "./FieldRenderer";
import { FieldEntity } from "@/types/form-config";
import { useForm, UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface FormFieldsProps {
  pageId: string;
  isLastPage: boolean
}

const FormFieldContainer = ({ pageId,isLastPage }: FormFieldsProps) => {
  const fieldEntities = useFormProperty("fieldEntities");
  const pageEntities = useFormProperty("pageEntities");


  const form = useForm({});

  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit(
          (data) => console.log(data),
          (errors) => console.log(JSON.stringify(errors, null, 2))
        )}
      >
        <div className="flex flex-wrap w-full [row-gap:1.5rem] overflow-clip [column-gap:0.5rem]">
          {pageEntities?.[pageId]?.fields?.map((fieldId) => (
            <Fragment key={fieldId}>
              <FieldRenderer
                control={form.control}
                field={fieldEntities?.[fieldId] as FieldEntity}
              />
            </Fragment>
          ))}
        </div>
        <Button className='mt-4' type="submit">{isLastPage ? "Submit" : "Next"}</Button>
      </form>
    </Form>
  );
};

export default FormFieldContainer;
