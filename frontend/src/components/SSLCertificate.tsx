import React, { Fragment, useState, useMemo } from 'react';
import {
    Divider,
    Box,
    Card,
    Stack, SxProps,
    Typography, List, ListItemButton, ListItemText
} from "@mui/material";
import { useQuery } from "react-query";
import { retriveModeTLSDataElement } from '../common/api.ts';
import { clickedButtonIndexAtom } from '../common/state';
import { useAtomValue,  } from "jotai";

interface CertificateNestedPartProps {
    hideName?: boolean;
    name: string;
    data: any;
    sx?: SxProps;
}

type CertRespone = {
    is_existed: boolean;
    cert: {
      subject: string[][];
      issuer: string[][];
      version: number;
      serialNumber: string;
      notBefore: string;
      notAfter: string;
      subjectAltName: string[][];
      OCSP: string[];
      caIssuers: string[];
      crlDistributionPoints: string[];
    };
    timeout: number;
  };

interface GetTLS{
  enviroment?:string
  scan_uuid?:string
  redictrion_idx:number
  depth:number
}
const NESTED_CERT_FIELDS = [
    { key: 'subject', name: 'Subject', check: 'subject' },
    { key: 'issuer', name: 'Issuer', check: 'issuer' },
];

const ALL_CERT_FIELDS = [
    ...NESTED_CERT_FIELDS,
    { key: 'validity', name: 'Validity', check: 'notBefore' },
    { key: 'subjectAltName', name: 'Subject Alt Names', check: 'subjectAltName' },
];

function useGetCertsQuery(params: GetTLS, enabled: boolean) {
    return useQuery(['certs', params], () => retriveModeTLSDataElement<CertRespone>(params), {
      enabled,
      refetchOnWindowFocus: false,
      retry: false,
    });
  }

function SSLCertificateCard({ scan_uuid, enviroment }: { scan_uuid?: string, enviroment?: string }) {
    const redirect_idx = useAtomValue(clickedButtonIndexAtom);
    const { data, isLoading, error } = useGetCertsQuery({
        scan_uuid: scan_uuid
        , enviroment: enviroment
        ,redictrion_idx:redirect_idx || 0
        ,depth:0 }
        , !!scan_uuid);

    const cert = data?.cert ?? null;
    const relevantCertFields = useMemo(() => {
        if (!cert) return [];
        return NESTED_CERT_FIELDS.filter(field => cert.hasOwnProperty(field.key));
    }, [cert]);

    const altNames = useMemo(() => {
        let result = cert?.subjectAltName;
        if (!result) return [];
        if (result.length > 5) {
            result = [...result.slice(0, 5), ['', `and ${result.length - 5} more...`]];
        }
        return result;
    }, [cert]);

    const [selectedField, setSelectedField] = useState('subject');

    return (
        <Card
            className={isLoading ? 'loading-base loading-small-blur' : 'loading-base'}
            sx={{ p: 2 , width:"50%", height:"450px"}}
        >
            <Typography
                variant="h6"
                fontFamily="Helvetica Medium"
            >
                SSL Certificate
            </Typography>

            {cert && (
                <Stack direction="row">
                    <List
                        sx={{
                            minWidth: 180,
                            borderRight: 'solid 1px #ffffff19',
                            pr: 2,
                            mr: 2,
                        }}>
                        {ALL_CERT_FIELDS.filter(field => cert && cert.hasOwnProperty(field.check)).map((field) => (
                            <ListItemButton
                                key={field.key}
                                selected={field.key === selectedField}
                                onClick={() => setSelectedField(field.key)}
                            >
                                <ListItemText>{field.name}</ListItemText>
                            </ListItemButton>
                        ))}
                    </List>

                    {cert && (
                        <>
                            {relevantCertFields.filter(field => field.key === selectedField).map((field) => (
                                <CertificateNestedPart
                                    hideName={true}
                                    key={field.key}
                                    name={field.name}
                                    data={cert[field.key]}
                                    sx={{ flex: 1, mt: 1 }}
                                />
                            ))}

                            {selectedField === 'subjectAltName' && (
                                <CertificatePart
                                    hideName={true}
                                    name="Subject Alt Names"
                                    items={altNames}
                                    sx={{ flex: 1, mt: 1 }}
                                />
                            )}

                            {selectedField === 'validity' && (
                                <CertificatePart
                                    hideName={true}
                                    name="Validity"
                                    items={[
                                        ['Not Before', cert['notBefore']],
                                        ['Not After', cert['notAfter']],
                                    ]}
                                    sx={{ flex: 1, mt: 1 }}
                                />
                            )}
                        </>
                    )}
                </Stack>
            )}
        </Card>
    );
}

function CertificateNestedPart(props: CertificateNestedPartProps) {
    const items = useMemo(() => {
        const result = [];
        for (const topLayer of props.data) {
            for (const field of topLayer) {
                result.push(field);
            }
        }

        return result;
    }, [props.data]);

    return (
        <CertificatePart
            hideName={props.hideName}
            name={props.name}
            items={items}
            sx={props.sx}
        />
    )
}

interface CertificatePartProps extends CertificatePartTableProps {
    hideName?: boolean;
    name: string;
    sx?: SxProps;
}

function CertificatePart(props: CertificatePartProps) {
    return (
        <Box
            sx={{
                ...props.sx
            }}
        >
            {!props.hideName && (
                <Typography variant="overline">
                    {props.name}
                </Typography>
            )}

            <CertificatePartTable
                items={props.items}
            />
        </Box>
    )
}

interface CertificatePartTableProps {
    items: [string, string][];
}

function CertificatePartTable(props: CertificatePartTableProps) {
    return (
        <Stack
            spacing={1}
            sx={{
                p: 1,
                px: 2,
                backgroundColor: '#ffffff30',
                borderRadius: 3,
            }}
        >
            {props.items.map((row, i) => (
                <Fragment key={i}>
                    <Stack direction="row">
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: 'left', color: 'white', width: 166,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}
                        >
                            <b>{row[0]}</b>
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                flex: 1,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}
                        >
                            {row[1]}
                        </Typography>
                    </Stack>

                    {i !== props.items.length - 1 && <Divider />}
                </Fragment>
            ))}
        </Stack>
    );
}

export default SSLCertificateCard;
