import { Fragment, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import FieldRenderer from './FieldRenderer';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { useFormProperty } from '@/zustand/store';
import useFieldUnregister from '@/hooks/useFieldUnregister';
import usePopulateFieldValidation from '@/hooks/usePopulateFieldValidation';

import { FieldEntity } from '@/types/form-config';
import useFieldConditionalLogicCheck from '@/hooks/useFieldConditionalLogicCheck';
import {
  rectSortingStrategy,
  rectSwappingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DragOverlay } from '@dnd-kit/core';

interface FormFieldsProps {
  pageId: string;
  isLastPage: boolean;
  activeField: FieldEntity | null;
}

const SortableFormFieldContainer = ({ pageId, isLastPage, activeField }: FormFieldsProps) => {
  const fieldEntities = useFormProperty('fieldEntities');
  const pageEntities = useFormProperty('pageEntities');

  const form = useForm({});
  const fields = useMemo(() => pageEntities?.[pageId]?.fields, [pageEntities, pageId]);

  // unregister fields that are no longer in the form - this is important for multipage forms with drag and drop
  useFieldUnregister(pageId, form);

  // for all fields populate the validation functions from the client validation map
  usePopulateFieldValidation(pageId);

  // // validate conditional logic for all fields
  useFieldConditionalLogicCheck(fields!);

  return (
    <SortableContext id={pageId} items={fields!} strategy={verticalListSortingStrategy}>
      <Form {...form}>
        <form
          className="w-full transition-all duration-200 ease-in-out"
          onSubmit={form.handleSubmit(
            (data) => console.log(data),
            (errors) => console.log(JSON.stringify(errors, null, 2)),
          )}
        >
          <div className="flex flex-wrap w-full overflow-clip [column-gap:0.5rem] transition-all duration-200 ease-in-out">
            {fields?.map((fieldId) => (
              <Fragment key={fieldId}>
                <FieldRenderer control={form.control} field={fieldEntities?.[fieldId] as FieldEntity} />
              </Fragment>
            ))}
          </div>
          {fields && fields?.length > 0 && (
            <Button className="mt-8 ml-2" type="submit">
              {isLastPage ? 'Submit' : 'Next'}
            </Button>
          )}

          {activeField?.id && (
            <DragOverlay>
              <FieldRenderer control={form.control} field={activeField as FieldEntity} isOverlay />
            </DragOverlay>
          )}
        </form>
      </Form>
    </SortableContext>
  );
};

export default SortableFormFieldContainer;