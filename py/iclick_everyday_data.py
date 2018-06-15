import requests
from bs4 import BeautifulSoup
import datetime
import csv
import time

date_format = "%Y-%m-%d"
f_name = "click365_{}_{:0>2}.csv"
csv_list = []


while True:
    now = datetime.datetime.now()

    try:
        url = "https://www.click-sec.com/corp/guide/c365/swplog/?year={}&month={:0>2}&pair=ZARJPY".format(now.year,now.month)
        html = requests.get(url)
        soup = BeautifulSoup(html.content, "html.parser")
        f = open("csv/click365/" + f_name.format(now.year,now.month), 'w')
        writer = csv.writer(f, lineterminator='\n')
        for i in range(int(now.day)):
            day = i + 1
            swap_tag = "#myForm > div.swap > table > tbody > tr:nth-of-type(" + str(day) + ") > td.col4.day"
            dt = datetime.date(now.year, now.month, day)
            swap_data= soup.select_one(swap_tag).text
            csv_list.append(dt.strftime(date_format))
            if swap_data:
                csv_list.append(swap_data)
            else:
                csv_list.append(0)
            writer.writerow(csv_list)
            csv_list = []
    
    except:
        pass

    f.close()
    time.sleep(3600)

