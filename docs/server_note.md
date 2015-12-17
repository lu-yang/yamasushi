### Get server constant (GET)
url : baseUrl + 'constant'

### Get turnover by turnoverId (GET)
url : baseUrl + 'turnover/totalPrice/'  + turnoverId

### Get all turnover group by parameter ( 1 -> all, 2 -> eat on site, 3 -> take away )
url : baseUrl + 'turnover/all/totalPrice/' + param

### Get orders by turnoverId (GET)
url : baseUrl + 'extOrders/locale/' + turnoverId

### Get all categories (GET)
url : baseUrl + 'categories/' + locale + '/1'

### Get all takeaways by date (GET)
url : baseUrl + 'takeaways/' + {from} + '/' + {to}

### Get takeaway by takeawayId (GET)
url : baseUrl + 'takeaway/' + {takeawayId}


### Open table (POST)
url : baseUrl + 'openTable'
data eg: { "tableID" : tableID }

### Change turnover status (POST)
url : baseUrl + 'turnover'
data eg: { "id" : id, "checkout" : true, "tableId" : tableID }


### Take order (POST)
url : baseUrl + 'orders/' + turnoverId + '/' + (true/false for print)
data eg:
[{  
	"count": 1,
	"product": {
		"id": 100,
		"categoryId": 16
	},
	"orderAttributions": null
}]

### Change order (POST)
url : baseUrl + 'orders/' + turnoverId + '/' + (true/false for print)
data eg:
[{
    "id": 888,
	"count": -1,
	"product": {
		"id": 100,
		"categoryId": 16
	},
	"orderAttributions": null
}]
