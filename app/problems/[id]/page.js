export default function ProblemDetail({ params }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Problem Detail</h1>
      <p>Problem ID: {params.id}</p>
      {/* TODO: Implement problem detail logic */}
    </div>
  );
}