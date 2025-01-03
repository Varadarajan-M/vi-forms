'use server';

import { createNewForm } from '@/lib/form';
import connectDb from '../db/connection';
import Form from '../models/form';
import { convertToPlainObject, verifyAuth } from '../util';
import { FormConfig } from '@/types/form-config';

export const createFormConfigAction = async () => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const newForm = createNewForm(userId as string);
    const form = new Form(newForm);
    const res = await form.save();

    return {
      success: true,
      data: convertToPlainObject(res) as FormConfig,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};

export const getAllUserFormsAction = async () => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const forms = await Form.aggregate([
      {
        $match: {
          createdBy: userId,
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $addFields: {
          meta: {
            title: '$name',
            description: '$description',
            status: '$status',
            submissions: 0,
            lastModified: '$updatedAt',
          },
        },
      },
    ]);

    return {
      success: true,
      data: convertToPlainObject(forms),
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};

export const deleteFormAction = async (id: string) => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const res = await Form.deleteOne({
      id,
      createdBy: userId,
    });

    return {
      success: true,
      data: convertToPlainObject(res),
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};

export const updateFormConfigAction = async (id: string, update: Partial<FormConfig>) => {
  try {
    const userId = await verifyAuth();
    await connectDb();
    const res = await Form.updateOne(
      { id, createdBy: userId },
      { ...update, createdBy: userId, id },
      { new: true, upsert: true },
    );

    return {
      success: true,
      data: convertToPlainObject(res),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error,
    };
  }
};
