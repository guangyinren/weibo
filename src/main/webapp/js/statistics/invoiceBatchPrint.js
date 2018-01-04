$(function () {
    window.InvoicePrint = {
        batchPrintUrl: basePath+"invoice/print/batch"+suffix,
        printInvoices: [],
        /**
         * 批量打印pdf
         */
        batchPrint: function () {
			if (InvoicePrint.printInvoices.length == 0) {
                return;
            }
            sdPrint({
                printable: getBatchPrintUrl(),
                pid: "batch_print_zone"
            });
            function getBatchPrintUrl() {
                return InvoicePrint.batchPrintUrl + "?nums="+InvoicePrint.printInvoices.join(",");
            }
        }
    };
    document.getElementById("batch_print").onclick = InvoicePrint.batchPrint;
});
