// components/AdminUserForm.tsx
import { Input } from '@heroui/input'
import { ModalBody, ModalFooter, ModalHeader } from '@heroui/modal'
import { PersonAdd, Refresh, Visibility, VisibilityOff } from '@mui/icons-material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { randomBytes } from "crypto";
import { Select, SelectItem } from '@heroui/select'
import { Button } from '@heroui/button'
import { CREATE_USER_URL, UPDATE_USER_URL } from '@/config/api-endpoints'
import toast from 'react-hot-toast'
import { on } from 'events'

export interface Values {
  _id: string,
  name: string
  email: string
  password: string
  userType?: number,
  account_status: number | string
}

export type AdminUserFormProps = {
  user?: Partial<Values> | null
  onClose: () => void
  onSuccess: () => void
}

const statusOptions = [
  { value: '0', label: 'Pending' },
  { value: '1', label: 'Active' },
  { value: '2', label: 'Suspend' },
  { value: '3', label: 'In-active' },
]

export const AdminUserForm: React.FC<AdminUserFormProps> = ({
  user,
  onClose,
  onSuccess
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty, isSubmitted },
  } = useForm<Values>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      account_status: '1',
    },
    mode: "all"
  })
  const [passwordVisibility, setPasswordVisibility] = React.useState(false)

  // whenever `user` changes (or open toggles), reset the form
  useEffect(() => {
    reset(
      user
        ? {
          name: user.name ?? '',
          email: user.email ?? '',
          password: '',
          account_status: user.account_status ?? '1',
        }
        : {
          name: '',
          email: '',
          password: randomBytes(16).toString('hex').substring(0, 8), // generate a random password
          account_status: '0',
        }
    )
  }, [user, reset, open])

  const onFormSubmit = async (data: Values) => {
    data.account_status = Number(data.account_status || '1') // ensure account_status is set
    data.userType = 0;
    let endpoint, method: "POST" | "PUT";
    if (user) {
      method = "PUT"
      endpoint = `${UPDATE_USER_URL}?user_id=${user["_id"]}`;
    } else {
      method = "POST"
      endpoint = CREATE_USER_URL
    }

    try {
      const result = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...data,
          user_type: 0
        })
      });

      if (!result.ok) {
        throw new Error("Failed to submit form");
      }
      const response = await result.json();
      if (response.error) {
        throw new Error(response.message || "Unknown error");
      }

      console.log("Form submitted successfully:", response);
      toast.success(user ? "User updated successfully" : "User created successfully");
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
      return;
    }
  }

  if (!open) return null

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <ModalHeader>
          {user ? 'Edit User' : 'Create User'}
        </ModalHeader>
        <ModalBody>
          <Input
            label="Name"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Enter Name"
            {...register('name', { required: 'Name is required' })}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />

          <Input
            label="Email"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Enter email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            className="mt-10"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />

          {!user && (
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type={passwordVisibility ? 'text' : 'password'}
                  label="Password"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Enter password"
                  className="mt-10"
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                  endContent={
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        title={passwordVisibility ? "Hide Password" : "Show Password"}
                        aria-label={passwordVisibility ? "Hide Password" : "Show Password"}
                        onClick={() => setPasswordVisibility(!passwordVisibility)}
                      >
                        {!passwordVisibility ? <Visibility color='action' /> : <VisibilityOff color='action' />}
                      </button>
                      <button
                        type="button"
                        title="Generate Random Password"
                        aria-label="Generate Random Password"
                        onClick={() => {
                          const newPassword = randomBytes(16).toString('hex').substring(0, 8);
                          setValue('password', newPassword, {
                            shouldDirty: true,
                            shouldValidate: true
                          })
                        }}
                      >
                        <Refresh color='action' />
                      </button>
                    </div>
                  }
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="account_status"
            render={({ field }) => (
              <Select
                {...field}
                label="Account Status"
                labelPlacement="outside"
                variant="bordered"
                key={"user-account-status"}
                defaultSelectedKeys={new Set([field.value?.toString() || '0'])}
                onSelectionChange={(keys) => {
                  field.onChange(keys.currentKey);
                }}
                aria-labelledby={`user-account-status`}
              >
                <SelectItem key={"0"} color="default" variant="flat">Pending</SelectItem>
                <SelectItem key={"1"}>Active</SelectItem>
                <SelectItem key={"2"}>Suspend</SelectItem>
                <SelectItem key={"3"}>In-active</SelectItem>
              </Select>
            )}
          />

        </ModalBody>
        <ModalFooter>
          <Button type="button" color="default" onPress={onClose}>
            Cancel
          </Button>
          <Button type="submit" color="primary" isLoading={isSubmitting}>
            Submit
          </Button>
        </ModalFooter>
      </form>
    </>
  )
}
