import { redirect } from "next/navigation"

interface Props {
  searchParams: { token?: string }
}

export default function ResetPasswordPage({ searchParams }: Props) {
  const token = searchParams.token || ""
  redirect(`/auth?mode=reset-password${token ? `&token=${token}` : ""}`)
}
