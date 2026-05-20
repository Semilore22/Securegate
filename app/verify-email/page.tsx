import { redirect } from "next/navigation"

interface Props {
  searchParams: { token?: string }
}

export default function VerifyEmailPage({ searchParams }: Props) {
  const token = searchParams.token || ""
  redirect(`/auth?mode=verify-email${token ? `&token=${token}` : ""}`)
}
