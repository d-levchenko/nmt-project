'use client';

import { ErrorMessage, Field, FieldArray, useFormikContext } from 'formik';
import type { QuestionType } from '@/types/quiz';
import {
  createEmptyQuestion,
  QuestionFormValues,
  QuizFormValues,
} from '@/types/quizFormTypes';

import css from './QuestionFields.module.css';

const QUESTION_TYPES: QuestionType[] = ['boolean', 'input', 'checkbox'];

interface Props {
  index: number;
  question: QuestionFormValues;
}

const QuestionFields = ({ index, question }: Props) => {
  const { setFieldValue } = useFormikContext<QuizFormValues>();
  const base = `questions.${index}`;

  const handleTypeChange = (newType: QuestionType) => {
    setFieldValue(base, {
      ...createEmptyQuestion(newType),
      questionText: question.questionText,
    });
  };

  return (
    <div className={css.wrapper}>
      <div className={css.field}>
        <Field
          name={`${base}.questionText`}
          placeholder="Question text"
          className={css.input}
        />

        <ErrorMessage
          name={`${base}.questionText`}
          component="p"
          className={css.error}
        />
      </div>

      <div className={css.field}>
        <label htmlFor={`${base}-type`} className={css.label}>
          Type
        </label>

        <select
          id={`${base}-type`}
          value={question.type}
          onChange={e => handleTypeChange(e.target.value as QuestionType)}
          className={css.select}>
          {QUESTION_TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {question.type === 'boolean' && (
        <fieldset className={css.fieldset}>
          <legend className={css.legend}>Correct answer</legend>

          <label className={css.inlineOption}>
            <input
              type="radio"
              name={`${base}.correctAnswerBoolean`}
              checked={question.correctAnswerBoolean === true}
              onChange={() =>
                setFieldValue(`${base}.correctAnswerBoolean`, true)
              }
            />
            True
          </label>

          <label className={css.inlineOption}>
            <input
              type="radio"
              name={`${base}.correctAnswerBoolean`}
              checked={question.correctAnswerBoolean === false}
              onChange={() =>
                setFieldValue(`${base}.correctAnswerBoolean`, false)
              }
            />
            False
          </label>
        </fieldset>
      )}

      {question.type === 'input' && (
        <div className={css.field}>
          <label htmlFor={`${base}-answer`} className={css.label}>
            Correct answer
          </label>

          <Field
            id={`${base}-answer`}
            name={`${base}.correctAnswerText`}
            placeholder="Correct answer"
            className={css.input}
          />

          <ErrorMessage
            name={`${base}.correctAnswerText`}
            component="p"
            className={css.error}
          />
        </div>
      )}

      {question.type === 'checkbox' && (
        <FieldArray name={`${base}.options`}>
          {({ push, remove }) => (
            <div className={css.field}>
              <label className={css.label}>
                Options (check the correct ones)
              </label>

              {question.options.map((_, optionIndex) => (
                <div key={optionIndex} className={css.optionRow}>
                  <Field
                    name={`${base}.options.${optionIndex}`}
                    placeholder={`Option ${optionIndex + 1}`}
                    className={css.input}
                  />

                  <label className={css.inlineOption}>
                    <input
                      type="checkbox"
                      checked={question.correctAnswerCheckboxIndexes.includes(
                        optionIndex,
                      )}
                      onChange={e => {
                        const current = question.correctAnswerCheckboxIndexes;

                        const next = e.target.checked
                          ? [...current, optionIndex]
                          : current.filter(i => i !== optionIndex);

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
                      className={css.removeButton}
                      onClick={() => {
                        remove(optionIndex);

                        const next = question.correctAnswerCheckboxIndexes
                          .filter(i => i !== optionIndex)
                          .map(i => (i > optionIndex ? i - 1 : i));

                        setFieldValue(
                          `${base}.correctAnswerCheckboxIndexes`,
                          next,
                        );
                      }}>
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <ErrorMessage
                name={`${base}.options`}
                component="p"
                className={css.error}
              />

              <ErrorMessage
                name={`${base}.correctAnswerCheckboxIndexes`}
                component="p"
                className={css.error}
              />

              <button
                type="button"
                className={css.addButton}
                onClick={() => push('')}>
                + Add option
              </button>
            </div>
          )}
        </FieldArray>
      )}
    </div>
  );
};

export default QuestionFields;
