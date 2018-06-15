from bs4 import BeautifulSoup
import datetime
import csv
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

#日付のデータ整形
dateFormat = "%y-%m-%d"
today = datetime.datetime.today()


def date_format(date_):
    month_day = date_.split('(').pop(0)
    date = str(today.year) + '/' + month_day

    return date
    

options = Options()
options.set_headless(True)

driver = webdriver.Chrome(executable_path=r"C:/Users/cw/Documents/workspace/chromedriver.exe",chrome_options=options)
driver.get("https://fx.dmm.com/market/swapcalendar_fx/index1.html")

driver.find_element_by_id("swapbtn2").click()

html = driver.page_source.encode('utf-8')
soup = BeautifulSoup(html, "html.parser")

f = open("csv/dmmfx/dmmfx_all_SwapData.csv", 'w')
writer = csv.writer(f, lineterminator='\n')

csv_list = []
tbody = soup.select_one("#table2 > tbody")
td = tbody.find_all("td")

num = 3

for tag in td:
    try:
        string_ = tag.get("class").pop(1)

        if "date" in string_:
            date_ = tag.string
            
            csv_list.append(date_format(date_))

            swap_tag = "#table2 > tbody > tr:nth-of-type(" + str(num) + ") > td:nth-of-type(5)"
            swapData = soup.select_one(swap_tag).contents
            csv_list.append("".join(map(str,swapData)))


            num += 3    
    except:
        pass

print("The process has been done successfully.")

writer.writerow(csv_list)
print(csv_list)
f.close()

driver.close()

driver.quit()





