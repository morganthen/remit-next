import { fetchInvoices, fetchCardData } from "./src/lib/data";

async function testFetch() {
  try {
    const invoices = await fetchInvoices();
    const invoicesData = await fetchCardData();
    console.log("Invoices Data:", invoicesData);
    console.log("✅ Data Fetch Successful!");
    console.table(invoices); // This prints a beautiful table in your terminal
  } catch (error) {
    console.error("❌ Fetch Failed:", error);
  }
}

testFetch();
