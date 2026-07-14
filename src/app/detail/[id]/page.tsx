import { redirect } from "next/navigation";

type Props = { params: { id: string } };

export default function DetailRedirect({ params }: Props) {
  redirect(`/movie/${params.id}`);
}
