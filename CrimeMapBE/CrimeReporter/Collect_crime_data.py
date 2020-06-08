from bs4 import BeautifulSoup
import urllib.request
import re

baseURL = (
    "https://mup.ks.gov.ba/aktuelno/vijesti?body_value=&field_opstina_value%5B%5D={0}"
    "&field_datum_kriminaliteta_value%5Bmin%5D%5Bday%5D={1}"
    "&field_datum_kriminaliteta_value%5Bmin%5D%5Bmonth%5D={2}"
    "&field_datum_kriminaliteta_value%5Bmin%5D%5Byear%5D={3}"
    "&field_datum_kriminaliteta_value%5Bmax%5D%5Bday%5D={4}"
    "&field_datum_kriminaliteta_value%5Bmax%5D%5Bmonth%5D={5}"
    "&field_datum_kriminaliteta_value%5Bmax%5D%5Byear%5D={6}"
)
"""
    0 - ID Opstine
    1 - od dana
    2 - od mjeseca
    3 - od godine
    4 - do dana
    5 - do mjeseca
    6 - do godine
"""

IDS = {
    # 1: 'Stanje u saobracaju',
    2: "Općina Stari Grad",
    3: "Opština Centar",
    4: "Općina Novo Sarajevo",
    5: "Općina Novi Grad",
    6: "Općina Ilidža",
    7: "Općina Hadžići",
    8: "Općina Trnovo",
    9: "Opština Vogošća",
    10: "Općina Ilijaš",
}


def list_of_crimes(url):
    entries_tuples = []
    page = urllib.request.urlopen(url).read()
    soup = BeautifulSoup(page, "lxml")
    full_list = soup.findAll("div", class_="item-list")
    for day_list in full_list:
        date = day_list.find("span", {"class": "date-display-single"}).text
        day_events = day_list.findAll("div", {"class": "aktuelno"})
        for item in day_events:
            url_href = "https://mup.ks.gov.ba" + str(item.find("a").get("href"))
            try:
                address = extract_address(url_href)
            except:
                address = "no address"
            entries_tuples.append((date, item.text, url_href, address))
    return entries_tuples


def extract_address(url):
    page = urllib.request.urlopen(url).read()
    soup = BeautifulSoup(page, "lxml")
    full_list = soup.findAll("span", style="font-style: normal")
    if not full_list:
        full_list = soup.findAll("div", class_="field-item even")
    clanak = []
    for item in full_list:
        clanak.append(item.text)
    clanak_tekst = "".join(map(str, clanak))
    address = re.findall(r"(((?<=ulici\s)|(?<=ul[.]\s)).*?(?=,))", clanak_tekst)
    return address[0][0]
