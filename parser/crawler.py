#!/usr/bin/python
# -*- coding: utf-8 -*-
import urllib2
import json
from bs4 import BeautifulSoup
from pymongo import MongoClient

def latinizeString(s):
    s = s.replace(u"ö", "o")
    s = s.replace(u"Ö", "O")
    s = s.replace(u"Ç", "C")
    s = s.replace(u"ç", "c")
    s = s.replace(u"İ", "I")
    s = s.replace(u"ı", "i")
    s = s.replace(u"ü", "u")
    s = s.replace(u"U", "U")
    s = s.replace(u"Ş", "S")
    s = s.replace(u"ş", "s")
    s = s.replace(u"ğ", "g")
    s = s.replace(u"Ğ", "G")

    return s

# Logic to return the next semester
def incrementSemester(semester):
    if semester[-1] == '1':
        return semester[:-1] + '2'
    else:
        return str(int(semester[:-1]) + 1) + '1'

# URL to the list of HH/H students
url = 'https://stars.bilkent.edu.tr/public/honor/?donem='
current = '19861'
end = '20161'

# print(escapeRegexCharacters('a.'))

# Dictionary of courses e.g. deptDict['CS'] == 'Computer Engineering'
deptDict = {}

host = 'localhost'
port = 27017

client = MongoClient(host, port)
db = client.leshonorables # Change the database name
collection = db['students']
collectionDept = db['departments']
collectionDept.delete_many({})
collection.delete_many({})

while current != end:
    print current
    # Get the curretn semester's page
    page = urllib2.urlopen(url + current).read()
    soup = BeautifulSoup(page, 'html.parser')
    soup.prettify()

    # Add the new departments.
    options = soup.findAll('option')
    for option in options:
        deptLong = option.text
        deptShort =  option['value']
        try:
            deptDict[deptShort]
        except KeyError:
            deptDict[deptShort] = deptLong
    tables = soup.findAll('table')

    for i in xrange(1, len(tables)):
        table = tables[i]
        curDept = table.findPrevious('b').find('a')['name']
        curFirstNamesH = []
        curLastNamesH = []
        curLastNamesHH = []
        curFirstNamesHH = []
        # print curDept
        trs = table.findAll('tr')
        honor = True
        for tr in trs:
            tds = tr.findAll('td')
            print tds
            if len(tds) == 0:
                th = tr.find('th')
                # print th.text
                if th.text != 'Honor':
                    honor = False
                else:
                    honor = True
            if len(tds) > 0:
                firstName =  u''.join(tds[0].text)
                lastName = u''.join(tds[1].text)

                if honor:
                    curFirstNamesH.append(firstName)
                    curLastNamesH.append(lastName)
                else:
                    curFirstNamesHH.append(firstName)
                    curLastNamesHH.append(lastName)
        for i in xrange(len(curFirstNamesH)):
            student = {'firstName': curFirstNamesH[i], 'lastName': curLastNamesH[i], 'firstNameLatin': latinizeString(curFirstNamesH[i]), 'lastNameLatin': latinizeString(curLastNamesH[i]), 'status': 'Honor', 'department': curDept, 'semester': current}
            # print student
            studentId = collection.insert_one(student).inserted_id
        for i in xrange(len(curFirstNamesHH)):
            student = {'firstName': curFirstNamesHH[i], 'lastName': curLastNamesHH[i], 'firstNameLatin': latinizeString(curFirstNamesHH[i]), 'lastNameLatin': latinizeString(curLastNamesHH[i]), 'status': 'High Honor', 'department': curDept, 'semester': current}
            # print student
            studentId = collection.insert_one(student).inserted_id
    current = incrementSemester(current)




for dept in deptDict:
    # print deptDict[dept]
    dept = {dept: deptDict[dept]}
    deptId = collectionDept.insert_one(dept).inserted_id
