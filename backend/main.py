import uuid
from typing import Dict, List, Optional

from fastapi import Body, Depends, FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/api/get_recently_upload_batch")
async def get_recently_upload_batch(
        from_index: int = 0, limit: int = 10, order_by_dest_inserted_at: bool = True
):
    return [
        {
            "batch_size": 1,
            "is_file": True,
            "name": "zxcx.csv",
            "inserted_at": "2024-05-19T14:31:31.508675",
            "batch_uuid": "bc8ea8ae-d0c3-490f-8c38-03de62b1bdeb",
        },
        {
            "batch_size": 1,
            "is_file": True,
            "name": "asd.csv",
            "inserted_at": "2024-05-19T14:31:07.919617",
            "batch_uuid": "26ea529c-01e8-4bb6-94bf-2eae51750df3",
        },
        {
            "batch_size": 1,
            "is_file": True,
            "name": "qwe.csv",
            "inserted_at": "2024-05-19T14:28:05.526224",
            "batch_uuid": "704b7cad-af18-4cdf-9a2e-30bfa60488a3",
        },
        {
            "batch_size": 1,
            "is_file": True,
            "name": "qwe2.csv",
            "inserted_at": "2024-05-19T14:25:38.103209",
            "batch_uuid": "825d8065-0629-412d-9874-ca03bf0f1b02",
        },
        {
            "batch_size": 1,
            "is_file": True,
            "name": "23fx.csv",
            "inserted_at": "2024-05-19T14:22:40.437189",
            "batch_uuid": "59af9a63-7544-4787-b882-70ae7b5ce124",
        },
        {
            "batch_size": 1,
            "is_file": True,
            "name": "234f.csv",
            "inserted_at": "2024-05-19T12:20:27.712064",
            "batch_uuid": "96e91202-97f4-46a1-989b-13c2c1f6b900",
        },
        {
            "batch_size": 1,
            "is_file": True,
            "name": "234sw.csv",
            "inserted_at": "2024-05-19T08:40:13.454768",
            "batch_uuid": "27819f79-c8d5-4b58-b476-c5a2c96d86f9",
        },
        {
            "batch_size": 1,
            "is_file": True,
            "name": "234fs.csv",
            "inserted_at": "2024-05-16T14:41:33.696828",
            "batch_uuid": "4ab76f8c-fffe-47d9-b32b-bfdef3188f21",
        },
        {
            "batch_size": 1,
            "is_file": True,
            "name": "23423.csv",
            "inserted_at": "2024-05-16T14:21:36.864000",
            "batch_uuid": "3678e2d1-4c46-46b6-a6d0-e567a914f39f",
        },
        {
            "batch_size": 1,
            "is_file": True,
            "name": "fiwwwwwle.csv",
            "inserted_at": "2024-05-16T14:20:31.458105",
            "batch_uuid": "cf1ef622-3628-4952-b093-a39a9f3bfd30",
        },
    ]


#     async with global_async_session() as session:
#         # Query to get the recently uploaded batches
#         result = await session.execute(
#             select(PgT0Batch)
#             .order_by(
#                 PgT0Batch.inserted_at.desc()
#                 if order_by_dest_inserted_at
#                 else PgT0Batch.inserted_at.asc()
#             )
#             .offset(from_index)
#             .limit(limit)
#         )
#         batches = result.scalars().all()

#     if not batches:
#         raise HTTPException(status_code=404, detail="No batches found")

#     return batches


@app.get("/api/all_scanned_urls")
async def get_all_scanned_urls(
        download_mode: bool = False,
        from_index: int = 0,
        limit: int = 20,
):
    import random
    import string

    return [
        {

            "insert_time": "2024-05-15T11:00:26.359495",
            "device": random.choice(["iphone", "android", "desktop"]),
            "url": f"https://{''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(random.randint(10, 30)))}.com",
            "batch_uuid": str(uuid.uuid4()),
            "scan_uuid": str(uuid.uuid4()),
            "label": random.choice(["Benign", "Malicious", "Unknown"]),

        }
        for _ in range(limit)
    ]


@app.get("/api/get_batch_status/url_status")
async def url_scanned_per_device(batch_uuid: str) -> Optional[Dict]:
    # TODO implment this function
    return {
        "done": 130,
        "inference": 370,
        "crawler": 300,
        "not_started_yet": 200,
        "batch_uuid": batch_uuid,
    }


@app.get("/api/get_batch_status/urls_inference")
async def url_inference_per_device(batch_uuid: str) -> Optional[Dict]:
    # TODO implment this function
    return {
        "benign": 370,
        "malicious": 210,
        "url_in_ood": 300,
        "not_started_yet": 200,
        "batch_uuid": batch_uuid,
    }


@app.get("/api/get_batch_items")
async def url_inference_per_device(
        batch_uuid: str,
        download_mode: bool,
        limit: int = 10,
) -> Optional[Dict]:
    import random
    import string

    download_dict_mock = (
        {"pasten": "pastenino"} if download_mode else {}
    )  # additiona data to download on csv

    return [
        {
            **{
                # "insert_time": "2024-05-15T11:00:26.359495",
                "device": random.choice(["iphone", "android", "desktop"]),
                "url": get_random_url(),
                "status": random.choice(["done", "inference", "crawler", "etls"]),
                "ood_classification": random.choice(["not ood", "", "unknown"]),
                "scams_classification": random.choice(
                    ["benign", "malicious", "unknown"]
                ),
                "enticement_method_classification": random.choice(
                    [
                        "Job",
                        "Romance",
                        "Investment",
                        "Lottery & Gambling",
                        "Finance & Banking",
                        "Business & E-Commerce",
                        "Public Services",
                        "Adult content",
                        "Streaming & Gaming",
                        "Others",
                    ]
                ),
                "scan_uuid": str(uuid.uuid4()),
                # "label": random.choice(["Benign", "Malicious", "Unknown"]),
            },
            **download_dict_mock,
        }
        for _ in range(limit)
    ]


def get_random_url():
    import random
    import string

    return f"https://{''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(random.randint(10, 30)))}.com"


@app.get("/api/analysis/scan/get_redirection")
async def get_redirection(scan_uuid: str, enviroment: str) -> Optional[Dict]:
    # TODO implment this function

    return [
        {
            "url": get_random_url(),
            "enviroment": enviroment,
            "depth": 0,
            "idx": i,
            "reason": 200,
            "ip": f"214.153.8.{i}",
        }
        for i in range(10)
    ]


@app.get("/api/analysis/scan/get_submitted_info")
async def get_submitted_info(scan_uuid: str, enviroment: str) -> Optional[Dict]:
    # TODO implment this function
    return {
        "url": get_random_url(),
        "raw_input": get_random_url(),
        "scan_uuid": scan_uuid,
        "enviroment": enviroment,
    }


@app.get("/api/analysis/scan/get_model_prediction_per_device")
async def get_model_prediction_per_device(
        scan_uuid: str, enviroment: str
) -> Optional[Dict]:
    # TODO implment this function
    import random

    return {
        "scams_model": {
            "prediction": random.choice(["benign", "malicious", "unknown"]),
            "prediction_score": random.random(),
        },
        "ood_model": {
            "prediction": random.choice(["not ood", "ood", "unknown"]),
            "prediction_score": random.random(),
        },
        "enticement_model": {
            "prediction": random.choice(["not ood", "ood", "unknown"]),
            "prediction_score": random.choice(
                [
                    "Job",
                    "Romance",
                    "Investment",
                    "Lottery & Gambling",
                    "Finance & Banking",
                    "Business & E-Commerce",
                    "Public Services",
                    "Adult content",
                    "Streaming & Gaming",
                    "Others",
                ]
            ),
        },
    }


@app.get("/api/analysis/scan/get_whois")
async def get_whois_redirection_per_device(
        scan_uuid: str, enviroment: str, redictrion_idx: int, depth: int
) -> Optional[Dict]:
    # TODO implment this function
    import random

    return {
        "domain_name": "EXAMPLE.COM",
        "registrar": "RESERVED-Internet Assigned Numbers Authority",
        "whois_server": "whois.iana.org",
        "referral_url": None,
        "updated_date": "2023-08-14 07:01:38",
        "creation_date": "1995-08-14 04:00:00",
        "expiration_date": "2024-08-13 04:00:00",
        "name_servers": ["A.IANA-SERVERS.NET", "B.IANA-SERVERS.NET"],
        "status": [
            "clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited",
            "clientTransferProhibited https://icann.org/epp#clientTransferProhibited",
            "clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited",
        ],
        "emails": None,
        "dnssec": "signedDelegation",
        "name": None,
        "org": None,
        "address": None,
        "city": None,
        "state": None,
        "registrant_postal_code": None,
        "country": None,
    }


@app.get("/api/analysis/scan/get_tls")
async def get_tls_redirection_per_device(
        scan_uuid: str, enviroment: str, redictrion_idx: int, depth: int
) -> Optional[Dict]:
    # TODO implment this function
    import random

    return {
        "is_existed": True,
        "cert": {
            "subject": [
                [["countryName", "US"]],
                [["stateOrProvinceName", "California"]],
                [["localityName", "Menlo Park"]],
                [["organizationName", "Meta Platforms, Inc."]],
                [["commonName", "*.facebook.com"]],
            ],
            "issuer": [
                [["countryName", "US"]],
                [["organizationName", "DigiCert Inc"]],
                [["organizationalUnitName", "www.digicert.com"]],
                [["commonName", "DigiCert SHA2 High Assurance Server CA"]],
            ],
            "version": 3,
            "serialNumber": "0FC8147E5882BDD8AC7882921C618FD9",
            "notBefore": "Feb 26 00:00:00 2024 GMT",
            "notAfter": "May 26 23:59:59 2024 GMT",
            "subjectAltName": [
                ["DNS", "*.facebook.com"],
                ["DNS", "*.facebook.net"],
                ["DNS", "*.fbcdn.net"],
                ["DNS", "*.fbsbx.com"],
                ["DNS", "*.m.facebook.com"],
                ["DNS", "*.messenger.com"],
                ["DNS", "*.xx.fbcdn.net"],
                ["DNS", "*.xy.fbcdn.net"],
                ["DNS", "*.xz.fbcdn.net"],
                ["DNS", "facebook.com"],
                ["DNS", "messenger.com"],
            ],
            "OCSP": ["http://ocsp.digicert.com"],
            "caIssuers": [
                "http://cacerts.digicert.com/DigiCertSHA2HighAssuranceServerCA.crt"
            ],
            "crlDistributionPoints": [
                "http://crl3.digicert.com/sha2-ha-server-g6.crl",
                "http://crl4.digicert.com/sha2-ha-server-g6.crl",
            ],
        },
        "timeout": 3,
    }


@app.get("/api/analysis/scan/get_screenshot")
async def get_sceenshot_per_device(
        scan_uuid: str, enviroment: str, redictrion_idx: int, depth: int
) -> Optional[Dict]:
    return {
        "s3": "s3://ronentest2/year=2024/month=3/day=3/uuid=13b62216_7f53_4a40_b083_998b003f1a2a/context=iphone/depth=0/page_uuid=fc806d2b_100e_46e2_8035_47562036a2b3/screenshot.png"
    }


@app.get("/api/analysis/scan/external_links")
async def get_external_links(
        scan_uuid: str, enviroment: str, redictrion_idx: int, depth: int
) -> Optional[Dict]:
    url = get_random_url()  # TODO change it to url based on params
    import base64
    import hashlib
    import urllib

    url_no_schema = url.replace("https://", "").replace("http://", "")

    url64 = base64.b64encode(url.encode("utf-8")).decode("utf-8")
    url_sha = hashlib.sha256(url.encode("utf-8")).hexdigest()

    return {
        "links": {
            "ScamAdviser": f"https://www.scamadviser.com/check-website/{url_no_schema}",
            "URLVoid": f"https://www.urlvoid.com/scan/{url_no_schema}/",
            "scamalert": f"https://www.scamalert.sg/search/{url64}/All/undefined",
            "Checkphish": f"https://app.checkphish.ai/live-scan?url={urllib.parse.quote(url)}",
            "Polyswarm": f"https://polyswarm.network/scan/results/url/{url_sha}",
        }
    }


@app.get("/api/analysis/scan/ip_info")
async def get_ipinfo_redirection(
        scan_uuid: str, enviroment: str, redictrion_idx: int, depth: int
) -> Optional[Dict]:
    return {
        "ip": "8.8.8.8",
        "hostname": "dns.google",
        "anycast": True,
        "city": "Mountain View",
        "region": "California",
        "country": "US",
        "loc": "37.4056,-122.0775",
        "org": "AS15169 Google LLC",
        "postal": "94043",
        "timezone": "America/Los_Angeles",
        "readme": "https://ipinfo.io/missingauth",
    }


@app.get("/api/analysis/scan/crtsh")
async def get_crtsh_redirection(
        scan_uuid: str, enviroment: str, redictrion_idx: int, depth: int
) -> Optional[Dict]:
    return [
        {
            "issuer_ca_id": 185752,
            "issuer_name": "C=US, O=DigiCert Inc, CN=DigiCert Global G2 TLS RSA SHA256 2020 CA1",
            "common_name": "www.example.org",
            "name_value": "example.com\nwww.example.com",
            "id": 12337892544,
            "entry_timestamp": "2024-03-10T20:13:50.549",
            "not_before": "2024-01-30T00:00:00",
            "not_after": "2025-03-01T23:59:59",
            "serial_number": "075bcef30689c8addf13e51af4afe187",
            "result_count": 2,
        },
        {
            "issuer_ca_id": -1,
            "issuer_name": "Issuer Not Found",
            "common_name": "example.com",
            "name_value": "example.com\nuser@example.com",
            "id": 8506962125,
            "entry_timestamp": None,
            "not_before": "2023-01-27T01:21:18",
            "not_after": "2033-01-24T01:21:18",
            "serial_number": "1ac1e693c87d36563a92ca145c87bbc26fd49f4c",
            "result_count": 3,
        },
    ]


@app.get("/api/analysis/scan/get_domian")
async def get_domain_rank_redirection(
        scan_uuid: str, enviroment: str, redictrion_idx: int, depth: int
) -> Optional[Dict]:
    return {
        "top_cisco": {"rank": 138841, "domain": "apkmirror.com"},
        "dom_cop": {"rank": 12974, "open page rank": 5.37, "domain": "apkmirror.com"},
        "top_alexa": {"rank": 2998, "domain": "apkmirror.com"},
    }


@app.get("/api/analysis/scan_redirection_info")
async def scan_redirection_info(
        scan_uuid: str, enviroment: str, redictrion_idx: int, depth: int
) -> Optional[Dict]:
    result_dict = {
        "tls": get_tls_redirection_per_device(
            scan_uuid, enviroment, redictrion_idx, depth
        ),
        "whois": get_whois_redirection_per_device(
            scan_uuid, enviroment, redictrion_idx, depth
        ),
        "ip_info": get_ipinfo_redirection(scan_uuid, enviroment, redictrion_idx, depth),
        "crtsh": get_crtsh_redirection(scan_uuid, enviroment, redictrion_idx, depth),
        "domian_rank": get_domain_rank_redirection(
            scan_uuid, enviroment, redictrion_idx, depth
        ),
        "screenshot": get_sceenshot_per_device(
            scan_uuid, enviroment, redictrion_idx, depth
        ),
        "external_links": get_external_links(scan_uuid, enviroment, redictrion_idx, depth)
    }
    return {key: await value for key, value in result_dict.items()}

# async def get_rediction_info(

# @app.get("/domain_to_ip")
# def domian_to_ip(
#     domain: str
#     # _auth=Depends(require_auth),
# ):
#     from crawler.utils.domain import Domain
#     domain_obj = Domain(domain)
#     domain_obj.get("")
