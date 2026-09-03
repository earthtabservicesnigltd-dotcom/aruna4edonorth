import { redirect } from "next/navigation";

export default function AcademyVerifyRedirect() {
  redirect("/verify/certificate");
}
