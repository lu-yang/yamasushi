Get server constant (GET)
url : baseUrl + 'constant'

Get turnover by turnoverId (GET)
url : baseUrl + 'turnover/totalPrice/'  + turnoverId

Get orders by turnoverId (GET)
url : baseUrl + 'extOrders/locale/' + turnoverId

Get all categories (GET)
url : baseUrl + 'categories/' + locale + '/1'

Open table (POST)
url : baseUrl + 'openTable'
data eg: { "tableID" : tableID }

Change turnover status (POST)
url : baseUrl + 'turnover'
data eg: { "id" : id, "checkout" : true, "tableId" : tableID }
