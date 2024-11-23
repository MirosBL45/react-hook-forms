import { useForm, useFieldArray } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
// import { useEffect } from 'react';

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
};

export default function YouTubeForm() {
  const formDeal = useForm<FormValues>({
    defaultValues: async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users/1'
      );
      const data = await response.json();
      return {
        username: 'Ruby',
        email: data.email,
        channel: '',
        social: {
          twitter: '',
          facebook: '',
        },
        phoneNumbers: ['', ''],
        phNumbers: [{ number: '' }],
        age: 0,
        dob: new Date(),
      };
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState,
    setError,
    watch,
    getValues,
    setValue,
  } = formDeal;

  const { errors, isSubmitting, touchedFields, dirtyFields, isDirty } =
    formState;

  console.log(touchedFields, dirtyFields, isDirty);

  // isDirty helps to see is form full. fe: button can be disabled when form is not full

  const { fields, append, remove } = useFieldArray({
    name: 'phNumbers',
    control,
  });

  async function onSubmitFun(data: FormValues) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // throw new Error();
      console.log('Form submitted', data);
      formDeal.reset();
    } catch (error) {
      setError('age', {
        message: 'Age is not god',
      });
    }
  }

  function handleGetValues() {
    console.log('Get values: ', getValues('social'));
  }

  function handleSetValue() {
    setValue('username', 'Ruby is nice cat', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     console.log(value);
  //   });

  //   return () => subscription.unsubscribe();
  // }, [watch]);

  const watchUserName = watch('username');

  renderCount++;

  return (
    <div>
      <h1>YouTube Form {renderCount / 2}</h1>
      <h2>Watched value: {watchUserName}</h2>

      <form onSubmit={handleSubmit(onSubmitFun)}>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register('username', {
              required: {
                value: true,
                message: 'Username is required',
              },
            })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: {
                value: true,
                message: 'Email is required',
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid',
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== 'admin@example.com' ||
                    'Enter a different email address'
                  );
                },
                notBlackListed: (fieldValue) => {
                  return (
                    !fieldValue.endsWith('baddomain.com') ||
                    'This domain is not supported'
                  );
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register('channel', {
              required: {
                value: true,
                message: 'Channel is required',
              },
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register('social.twitter', {
              disabled: watch('channel') === '',
              required: 'Enter twitter profile',
            })}
          />
        </div>
        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input type="text" id="facebook" {...register('social.facebook')} />
        </div>
        <div className="form-control">
          <label htmlFor="primary-phone">Primary phone Number</label>
          <input
            type="text"
            id="primary-phone"
            {...register('phoneNumbers.0', {
              required: {
                value: true,
                message: 'Primary phone number is required',
              },
            })}
          />
          <p className="error">{errors.phoneNumbers?.[0]?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary phone Number</label>
          <input
            type="text"
            id="secondary-phone"
            {...register('phoneNumbers.1')}
          />
        </div>

        <div>
          <label>List of phone numbers</label>
          <div>
            {fields.map((field, index) => (
              <div className="form-control" key={field.id}>
                <input
                  type="text"
                  {...register(`phNumbers.${index}.number` as const)}
                />
                {index > 0 && (
                  <button type="button" onClick={() => remove(index)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => append({ number: '' })}>
              Add phone number
            </button>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register('age', {
              valueAsNumber: true,
              required: {
                value: true,
                message: 'age is required',
              },
            })}
          />
          <p className="error">{errors.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">Date of birth</label>
          <input
            type="date"
            id="dob"
            {...register('dob', {
              valueAsDate: true,
              required: {
                value: true,
                message: 'dob is required',
              },
            })}
          />
          <p className="error">{errors.dob?.message}</p>
        </div>

        <button disabled={isSubmitting}>
          {isSubmitting ? 'Loading' : 'Submit'}
        </button>

        <button type="button" onClick={handleGetValues}>
          Get Values
        </button>

        <button type="button" onClick={handleSetValue}>
          Set Value
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
}
