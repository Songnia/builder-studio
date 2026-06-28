import React from 'react';
import {
    Document,
    Page,
    View,
    Text,
    Image,
    StyleSheet,
} from '@react-pdf/renderer';

const GREEN = '#22c55e';
const SLATE_900 = '#0f172a';
const SLATE_500 = '#64748b';
const SLATE_400 = '#94a3b8';
const SLATE_100 = '#f1f5f9';
const SLATE_50 = '#f8fafc';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
        padding: '20mm',
        fontSize: 10,
        color: SLATE_900,
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    logo: {
        width: 120,
        height: 'auto',
        marginBottom: 8,
    },
    studioName: {
        fontSize: 16,
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: SLATE_900,
    },
    studioInfo: {
        fontSize: 8,
        color: SLATE_500,
        marginTop: 2,
    },
    invoiceTitle: {
        textAlign: 'right',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: SLATE_900,
    },
    invoiceNumber: {
        fontSize: 8,
        color: GREEN,
        fontWeight: 700,
        marginTop: 4,
    },
    // Client section
    clientSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    clientBlock: {
        flex: 1,
    },
    clientLabel: {
        fontSize: 7,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: SLATE_400,
        fontWeight: 700,
        marginBottom: 6,
    },
    clientName: {
        fontSize: 12,
        fontWeight: 700,
        color: SLATE_900,
        marginBottom: 2,
    },
    clientInfo: {
        fontSize: 8,
        color: SLATE_500,
        lineHeight: 1.5,
    },
    dateBlock: {
        backgroundColor: SLATE_50,
        borderRadius: 8,
        padding: 12,
        minWidth: 160,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    dateLabel: {
        fontSize: 7,
        textTransform: 'uppercase',
        color: SLATE_400,
        fontWeight: 700,
    },
    dateValue: {
        fontSize: 8,
        fontWeight: 700,
        color: SLATE_900,
    },
    // Divider
    divider: {
        borderBottomWidth: 2,
        borderBottomColor: SLATE_900,
        marginBottom: 8,
    },
    // Table
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: SLATE_900,
        paddingBottom: 6,
        marginBottom: 4,
    },
    colDescription: { flex: 3 },
    colQty: { flex: 1, textAlign: 'center' },
    colTotal: { flex: 1, textAlign: 'right' },
    tableHeaderText: {
        fontSize: 7,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: SLATE_400,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: SLATE_100,
    },
    cellDescription: {
        flex: 3,
        fontSize: 9,
        color: SLATE_900,
        fontWeight: 700,
    },
    cellQty: {
        flex: 1,
        fontSize: 9,
        color: SLATE_500,
        textAlign: 'center',
    },
    cellTotal: {
        flex: 1,
        fontSize: 9,
        fontWeight: 700,
        color: SLATE_900,
        textAlign: 'right',
    },
    // Totals
    totalsSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 24,
    },
    totalsBox: {
        width: 200,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    totalLabel: {
        fontSize: 8,
        color: SLATE_500,
    },
    totalValue: {
        fontSize: 8,
        color: SLATE_500,
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 2,
        borderTopColor: SLATE_900,
        marginTop: 6,
        paddingTop: 8,
    },
    grandTotalLabel: {
        fontSize: 10,
        fontWeight: 700,
        color: SLATE_900,
    },
    grandTotalValue: {
        fontSize: 12,
        fontWeight: 900,
        color: GREEN,
    },
    // Footer
    footer: {
        marginTop: 'auto',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: SLATE_100,
        textAlign: 'center',
    },
    footerText: {
        fontSize: 7,
        color: SLATE_400,
    },
});

interface PDFProps {
    inv: any;
    studio: any;
    logoBase64?: string;
    subtotal: number;
    taxAmount: number;
    total: number;
}

const fmt = (n: number) =>
    Number(n)
        .toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
        .replace(/[\s\u202F\u00A0]/g, ' ');

const InvoicePDFDocument: React.FC<PDFProps> = ({
    inv,
    studio,
    logoBase64,
    subtotal,
    taxAmount,
    total,
}) => (
    <Document title={`Facture ${inv.invoice_number}`} author={studio.photographerName}>
        <Page size="A4" style={styles.page}>
            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    {logoBase64 && (
                        <Image src={logoBase64} style={styles.logo} />
                    )}
                    <Text style={styles.studioName}>{studio.photographerName}</Text>
                    <Text style={styles.studioInfo}>{studio.email}</Text>
                    <Text style={styles.studioInfo}>{studio.address}</Text>
                    <Text style={styles.studioInfo}>{studio.phone}</Text>
                </View>
                <View style={styles.invoiceTitle}>
                    <Text style={styles.titleText}>FACTURE</Text>
                    <Text style={[styles.invoiceNumber, { color: studio.primaryColor || GREEN }]}>{inv.invoice_number}</Text>
                </View>
            </View>

            {/* CLIENT + DATES */}
            <View style={styles.clientSection}>
                <View style={styles.clientBlock}>
                    <Text style={styles.clientLabel}>Facturé à :</Text>
                    <Text style={styles.clientName}>{inv.client_name}</Text>
                    {inv.client_phone && <Text style={styles.clientInfo}>{inv.client_phone}</Text>}
                    {inv.client_address && <Text style={styles.clientInfo}>{inv.client_address}</Text>}
                </View>
                <View style={styles.dateBlock}>
                    <View style={styles.dateRow}>
                        <Text style={styles.dateLabel}>DATE</Text>
                        <Text style={styles.dateValue}>
                            {new Date(inv.issue_date).toLocaleDateString('fr-FR')}
                        </Text>
                    </View>
                    {inv.due_date && (
                        <View style={styles.dateRow}>
                            <Text style={styles.dateLabel}>ÉCHÉANCE</Text>
                            <Text style={styles.dateValue}>
                                {new Date(inv.due_date).toLocaleDateString('fr-FR')}
                            </Text>
                        </View>
                    )}
                    <View style={styles.dateRow}>
                        <Text style={styles.dateLabel}>N° FACT.</Text>
                        <Text style={styles.dateValue}>{inv.invoice_number}</Text>
                    </View>
                </View>
            </View>

            {/* TABLE */}
            <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.colDescription]}>Prestation</Text>
                <Text style={[styles.tableHeaderText, styles.colQty]}>Qté</Text>
                <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
            </View>

            {inv.items.map((item: any, idx: number) => (
                <View key={idx} style={styles.tableRow} wrap={false}>
                    <Text style={styles.cellDescription}>{item.description || '—'}</Text>
                    <Text style={styles.cellQty}>{item.quantity}</Text>
                    <Text style={styles.cellTotal}>{fmt(Number(item.quantity) * Number(item.unit_price))} FCFA</Text>
                </View>
            ))}

            {/* TOTALS */}
            <View style={styles.totalsSection}>
                <View style={styles.totalsBox}>
                    {inv.include_tax && (
                        <>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Hors Taxe</Text>
                                <Text style={styles.totalValue}>{fmt(subtotal)} FCFA</Text>
                            </View>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>TVA ({inv.tax_rate}%)</Text>
                                <Text style={styles.totalValue}>{fmt(taxAmount)} FCFA</Text>
                            </View>
                        </>
                    )}
                    <View style={styles.grandTotalRow}>
                        <Text style={[styles.grandTotalLabel, { color: studio.primaryColor || GREEN }]}>
                            {inv.include_tax ? 'TOTAL TTC' : 'TOTAL NET'}
                        </Text>
                        <Text style={[styles.grandTotalValue, { color: studio.primaryColor || GREEN }]}>{fmt(total)} FCFA</Text>
                    </View>
                    {Number(inv.amount_paid) > 0 && (
                        <>
                            <View style={[styles.totalRow, { marginTop: 8 }]}>
                                <Text style={styles.totalLabel}>Acompte versé</Text>
                                <Text style={styles.totalValue}>{fmt(Number(inv.amount_paid))} FCFA</Text>
                            </View>
                            <View style={[styles.grandTotalRow, { borderTopWidth: 1, borderTopColor: '#94a3b8', paddingTop: 4 }]}>
                                <Text style={[styles.grandTotalLabel, { color: '#ef4444' }]}>RESTE À PAYER</Text>
                                <Text style={[styles.grandTotalValue, { color: '#ef4444' }]}>{fmt(total - Number(inv.amount_paid))} FCFA</Text>
                            </View>
                        </>
                    )}
                </View>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    {studio.photographerName} · {studio.email} · {studio.phone}
                </Text>
            </View>
        </Page>
    </Document>
);

export default InvoicePDFDocument;
