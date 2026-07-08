import VPSDetails from "@/components/VPSDetails";

export default async function VpsDetailsPage({
      params,
}: {
      params: { id: string };
}) {
      const { id } = await params;

      return <VPSDetails id={id} />;
}
