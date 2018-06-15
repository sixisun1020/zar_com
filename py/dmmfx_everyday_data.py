from bs4 import BeautifulSoup
import datetime
import csv
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

dateFormat = "%y-%m-%d"

#注意事項
#Web上のスワップポイントの更新が複数日された際は、抜けがでてしまう。
#最新日以外のデータが更新された場合は、反映されない。

#日付のデータ整形
#@param:strings
def date_format(date_):
    month_day = date_.split('(').pop(0)
    date = str(today.year) + '/' + month_day

    return date
    
while True:
    today = datetime.datetime.today()
    #10時と20時にスクレイピングをするよう設定
    if datetime.datetime.now().hour % 10 == 0:
        #スクレイピング
        options = Options()
        options.set_headless(True)

        driver = webdriver.Chrome(executable_path=r"C:/Users/cw/Documents/workspace/chromedriver.exe",chrome_options=options)
        driver.get("https://fx.dmm.com/market/swapcalendar_fx/index1.html")

        driver.find_element_by_id("swapbtn2").click()

        html = driver.page_source.encode('utf-8')
        soup = BeautifulSoup(html, "html.parser")


        csv_list = []
        latest_list = []

        #Web上から最新の日付、スワップポイントをスクレイピング
        latest_date = "".join(soup.select_one("#table2 > tbody > tr:nth-of-type(1) > td.under.date").contents)
        l_date = date_format(latest_date)
        latest_list.append(l_date)

        latest_swap = "".join(soup.select_one("#table2 > tbody > tr:nth-of-type(3) > td:nth-of-type(5)").contents)
        latest_list.append(latest_swap)

        driver.close()
        driver.quit()

        #csvファイルからデータを読み込む
        f_r = open("csv/dmmfx/dmmfx_all_SwapData.csv", 'r')
        f_dt = csv.reader(f_r)

        for row in f_dt:
            csv_list.append(row)

        csv_list = csv_list[0]
        f_r.close(csv_list)

        #CSVファイルの最新の日付と、Web上の最新の日付が一致しているかの確認
        if l_date == csv_list[0]:
            pass

        else:
            f_w = open("csv/dmmfx/dmmfx_all_SwapData.csv", 'w')
            writer = csv.writer(f_w, lineterminator='\n')
   
            #スクレイピングしてきたデータを変数csv_listに格納し、csvファイルに上書き保存する。
            for l_dt in latest_list:
                csv_list.insert(1, l_dt)
            writer.writerow(csv_list)
            f_w.close()
            print("working successfully.")
        time.sleep(3600)
    time.sleep(3600)