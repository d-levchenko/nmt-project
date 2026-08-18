'use client';

import {
  Field,
  FieldArray,
  ErrorMessage,
  Form,
  Formik,
  useFormikContext,
} from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createQuiz } from '@/lib/api';
import { getApiError } from '@/lib/error';
import type { QuestionType } from '@/types';
import {
  createEmptyQuestion,
  QuestionFormValues,
  QuizFormValues,
  toCreateQuizPayload,
} from '@/types/quizFormTypes';

const validationSchema = Yup.object({
  title: Yup.string().trim().min(1).max(150).required('Title is required.'),
  description: Yup.string().max(1000),
  questions: Yup.array()
    .of(
      Yup.lazy((value: QuestionFormValues) => {
        const common = {
          type: Yup.string().required(),
          questionText: Yup.string()
            .trim()
            .min(5, 'Question text should be at least 5 characters.')
            .required('Question text is required.'),
        };

        if (value?.type === 'boolean') {
          return Yup.object({
            ...common,
            type: Yup.mixed<'boolean'>().oneOf(['boolean']).required(),
            correctAnswerBoolean: Yup.boolean().required(),
          });
        }

        if (value?.type === 'input') {
          return Yup.object({
            ...common,
            type: Yup.mixed<'input'>().oneOf(['input']).required(),
            correctAnswerText: Yup.string()
              .trim()
              .required('Correct answer is required.'),
          });
        }

        return Yup.object({
          ...common,
          type: Yup.mixed<'checkbox'>().oneOf(['checkbox']).required(),
          options: Yup.array()
            .of(Yup.string().trim().required('Option cannot be empty.'))
            .min(2, 'Add at least two options.')
            .required(),
          correctAnswerCheckboxIndexes: Yup.array()
            .of(Yup.number().integer().min(0))
            .min(1, 'Select at least one correct option.')
            .required(),
        }).test(
          'valid-indices',
          'Invalid correct option.',
          value =>
            !!value &&
            value.correctAnswerCheckboxIndexes.every(
              index => index != null && index < value.options.length,
            ),
        );
      }),
    )
    .min(1, 'Add at least one question.')
    .required(),
});

const TYPES: QuestionType[] = ['boolean', 'input', 'checkbox'];

function QuestionEditor({
  index,
  question,
}: {
  index: number;
  question: QuestionFormValues;
}) {
  const { setFieldValue } = useFormikContext<QuizFormValues>();
  const base = `questions.${index}`;

  const changeType = (type: QuestionType) => {
    setFieldValue(base, createEmptyQuestion(type));
  };

  return (
    <div className="space-y-4 rounded-xl border bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold">Question {index + 1}</h3>
        <select
          value={question.type}
          onChange={event => changeType(event.target.value as QuestionType)}
          className="rounded-lg border bg-white px-3 py-2">
          {TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <label className="block text-sm font-medium">
        Question
        <Field
          name={`${base}.questionText`}
          className="mt-1 w-full rounded-lg border bg-white px-3 py-2"
        />
        <ErrorMessage
          name={`${base}.questionText`}
          component="p"
          className="mt-1 text-sm text-red-600"
        />
      </label>

      {question.type === 'boolean' && (
        <div>
          <p className="text-sm font-medium">Correct answer</p>
          <div className="mt-2 flex gap-5">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={question.correctAnswerBoolean === true}
                onChange={() =>
                  setFieldValue(`${base}.correctAnswerBoolean`, true)
                }
              />
              True
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={question.correctAnswerBoolean === false}
                onChange={() =>
                  setFieldValue(`${base}.correctAnswerBoolean`, false)
                }
              />
              False
            </label>
          </div>
        </div>
      )}

      {question.type === 'input' && (
        <label className="block text-sm font-medium">
          Correct answer
          <Field
            name={`${base}.correctAnswerText`}
            className="mt-1 w-full rounded-lg border bg-white px-3 py-2"
          />
          <ErrorMessage
            name={`${base}.correctAnswerText`}
            component="p"
            className="mt-1 text-sm text-red-600"
          />
        </label>
      )}

      {question.type === 'checkbox' && (
        <FieldArray name={`${base}.options`}>
          {({ push, remove }) => (
            <div className="space-y-2">
              <p className="text-sm font-medium">Options</p>
              {question.options.map((_, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <Field
                    name={`${base}.options.${optionIndex}`}
                    placeholder={`Option ${optionIndex + 1}`}
                    className="flex-1 rounded-lg border bg-white px-3 py-2"
                  />
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={question.correctAnswerCheckboxIndexes.includes(
                        optionIndex,
                      )}
                      onChange={event => {
                        const current = question.correctAnswerCheckboxIndexes;
                        const next = event.target.checked
                          ? [...current, optionIndex]
                          : current.filter(index => index !== optionIndex);
                        setFieldValue(
                          `${base}.correctAnswerCheckboxIndexes`,
                          next,
                        );
                      }}
                    />
                    Correct
                  </label>
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        remove(optionIndex);
                        const next = question.correctAnswerCheckboxIndexes
                          .filter(index => index !== optionIndex)
                          .map(index =>
                            index > optionIndex ? index - 1 : index,
                          );
                        setFieldValue(
                          `${base}.correctAnswerCheckboxIndexes`,
                          next,
                        );
                      }}
                      className="text-sm text-red-600">
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <ErrorMessage
                name={`${base}.options`}
                component="p"
                className="text-sm text-red-600"
              />
              <ErrorMessage
                name={`${base}.correctAnswerCheckboxIndexes`}
                component="p"
                className="text-sm text-red-600"
              />
              <button
                type="button"
                onClick={() => push('')}
                className="rounded-lg border bg-white px-3 py-2 text-sm">
                + Add option
              </button>
            </div>
          )}
        </FieldArray>
      )}
    </div>
  );
}

export default function QuizForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');
  const initialValues: QuizFormValues = {
    title: '',
    description: '',
    questions: [createEmptyQuestion('boolean')],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitError('');
        try {
          const quiz = await createQuiz(toCreateQuizPayload(values));
          router.push(`/quizzes/${quiz.id}`);
        } catch (error) {
          setSubmitError(getApiError(error));
        } finally {
          setSubmitting(false);
        }
      }}>
      {({ values, isSubmitting }) => (
        <Form className="space-y-6">
          <label className="block text-sm font-medium">
            Quiz title
            <Field
              name="title"
              placeholder="e.g. JavaScript Basics"
              className="mt-1 w-full rounded-lg border bg-white px-3 py-3"
            />
            <ErrorMessage
              name="title"
              component="p"
              className="mt-1 text-sm text-red-600"
            />
          </label>

          <label className="block text-sm font-medium">
            Description
            <Field
              as="textarea"
              name="description"
              rows={3}
              className="mt-1 w-full rounded-lg border bg-white px-3 py-3"
            />
          </label>

          <FieldArray name="questions">
            {({ push, remove }) => (
              <div className="space-y-4">
                {values.questions.map((question, index) => (
                  <div key={index}>
                    <QuestionEditor index={index} question={question} />
                    {values.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-2 text-sm text-red-600">
                        Remove question
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex flex-wrap gap-2">
                  {TYPES.map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => push(createEmptyQuestion(type))}
                      className="rounded-lg border bg-white px-3 py-2 text-sm">
                      + {type} question
                    </button>
                  ))}
                </div>
              </div>
            )}
          </FieldArray>

          {submitError && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white">
            {isSubmitting ? 'Creating…' : 'Create quiz'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
