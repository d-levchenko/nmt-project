'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { quizValidationSchema } from '@/validation/quizValidationSchema';
import { createQuiz } from '@/lib/quizApi';
import { ApiError } from '@/lib/apiClient';
import type { QuestionType } from '@/types';
import QuestionFields from './QuestionFields';
import {
  createEmptyQuestion,
  QuizFormValues,
  toCreateQuizPayload,
} from '@/types/quizFormTypes';

import css from './QuizForm.module.css';

const QUESTION_TYPES: QuestionType[] = ['boolean', 'input', 'checkbox'];

const initialValues: QuizFormValues = {
  title: '',
  questions: [createEmptyQuestion('boolean')],
};

const QuizForm = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (
    values: QuizFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setSubmitError(null);

    try {
      const quiz = await createQuiz(toCreateQuizPayload(values));
      router.push(`/quizzes/${quiz._id}`);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? [err.message, ...(err.details ?? [])].join(' — ')
          : 'Something went wrong while creating the quiz.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={quizValidationSchema}
      onSubmit={handleSubmit}>
      {({ values, isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.field}>
            <label htmlFor="title" className={css.label}>
              Quiz title
            </label>

            <Field
              id="title"
              name="title"
              placeholder="e.g. JavaScript Basics"
              className={css.input}
            />

            <ErrorMessage name="title" component="p" className={css.error} />
          </div>

          <FieldArray name="questions">
            {({ push, remove }) => (
              <div className={css.questions}>
                {values.questions.map((question, index) => (
                  <div key={index} className={css.questionCard}>
                    <div className={css.questionHeader}>
                      <strong className={css.questionTitle}>
                        Question {index + 1}
                      </strong>

                      {values.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className={css.removeButton}>
                          Remove
                        </button>
                      )}
                    </div>

                    <QuestionFields index={index} question={question} />
                  </div>
                ))}

                <div className={css.addQuestion}>
                  {QUESTION_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      className={css.addButton}
                      onClick={() => push(createEmptyQuestion(type))}>
                      + {type} question
                    </button>
                  ))}
                </div>
              </div>
            )}
          </FieldArray>

          {submitError && <p className={css.error}>{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={css.submitButton}>
            {isSubmitting ? 'Creating…' : 'Create quiz'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default QuizForm;
