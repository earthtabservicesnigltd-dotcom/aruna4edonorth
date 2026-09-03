import { redirect } from "next/navigation";

export default async function AcademyVerifyDynamicRedirect({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  redirect(`/verify/certificate/${certificateId}`);
}