import requests
from bs4 import BeautifulSoup
import datetime
import csv
import time

date_format = "%Y-%m-%d"
f_name = "click365_{}_{:0>2}.csv"
csv_list = []


for i in range(2):
    year = 2017 + i

    for j in range (12):
        month = 1 + j
        f = open("csv/click365/" + f_name.format(year,month), 'a')
        writer = csv.writer(f, lineterminator='\n')
        time.sleep(1)
        try:
            url = "https://www.click-sec.com/corp/guide/c365/swplog/?year={}&month={:0>2}&pair=ZARJPY".format(year,month)
            html = requests.get(url)
            soup = BeautifulSoup(html.content, "html.parser")

            for i in range(31):
                day = i+1

                swap_tag = "#myForm > div.swap > table > tbody > tr:nth-of-type(" + str(day) + ") > td.col4.day"
                dt = datetime.date(year, month, day)
                swap_date = soup.select_one(swap_tag).text

                csv_list.append(dt.strftime(date_format))
                if swap_date:
                    csv_list.append(swap_date)
                else:
                    csv_list.append(0)
                writer.writerow(csv_list)
                csv_list = []

            f.close()
        except:
            f.close()
            pass











