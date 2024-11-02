import Results from "@/views/results";

const ResultsPage = () => {
  return (
    // <HydrationBoundary state={dehydratedState}>
    <Results />
    // </HydrationBoundary>
  );
};

export default ResultsPage;

// export const getServerSideProps = (async (context) => {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery(
//     getPublicReportQueryOptions({
//       domain: context.query.domain as string,
//     }),
//   );

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }) satisfies GetServerSideProps;
