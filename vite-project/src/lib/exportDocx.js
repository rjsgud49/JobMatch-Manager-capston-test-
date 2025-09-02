// src/lib/exportDocx.js
import { Document, Packer, Paragraph, TextRun } from "docx"
import { saveAs } from "file-saver"

export async function exportContractDocx(contract) {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "근로 계약서",
                                bold: true,
                                size: 32,
                            }),
                        ],
                    }),
                    new Paragraph(" "),
                    new Paragraph(`제목: ${contract.title}`),
                    new Paragraph(`형태: ${contract.type}`),
                    new Paragraph(`기간: ${contract.startDate} ~ ${contract.endDate}`),
                    new Paragraph(`고용주: ${contract.employer}`),
                    new Paragraph(`계약자: ${contract.contractor}`),
                    new Paragraph(`보상: ${contract.rateType} ${contract.rate.toLocaleString()}원`),
                    new Paragraph(" "),
                    new Paragraph("계약 조항:"),
                    ...contract.terms.split("\n").map(
                        (line) =>
                            new Paragraph({
                                children: [new TextRun({ text: "- " + line })],
                            })
                    ),
                ],
            },
        ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `계약서_${contract.contractor}_${contract.startDate}.docx`)
}
