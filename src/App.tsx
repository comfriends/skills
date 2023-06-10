import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import Layout from "layout/Layout";

function App() {
  return (
    // <QueryClientProvider client={queryClient}>
    // <BrowserRouter>
    // <Layout>
    //   <Routes>
    //     {/* <Route path="*" element={<Charts  />} /> */}
    //     <Route path="*" element={<Carousel  />} />
    //     <Route path="/gridtable" element={<GridTable data={mock.GridTableData} dropDownData={{army: ['군필', '미필']}} />} />
    //     {/* <Route path="*" element={<DualListbox primaryData={mock.DualListBoxData.primary} secondaryData={mock.DualListBoxData.secondary} />} /> */}
    //     {/* <Route path="*" element={<NotFound />} /> */}
    //     <Route path="/duallistbox" element={<DualListbox primaryData={mock.DualListBoxData.primary} secondaryData={mock.DualListBoxData.secondary} />} />
    //   </Routes>
    // </Layout>
    // </BrowserRouter>
    // </QueryClientProvider>
    <>
      <Layout />
    </>
  );
}

export default App;
