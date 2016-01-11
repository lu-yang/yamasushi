### Get server constant (GET)
`url : baseUrl + 'constant'`

### Get available tables  (GET)
`url : baseUrl + 'availableTables'`


### Get turnover by turnoverId (GET)
`url : baseUrl + 'turnover/totalPrice/'  + turnoverId`

### Get all turnover group by parameter
**( 1 -> all, 2 -> eat on site, 3 -> take away )**  
`url : baseUrl + 'turnover/all/totalPrice/' + param`

### Get orders by turnoverId (GET)
`url : baseUrl + 'extOrders/locale/' + turnoverId`

### Get all categories (GET)
`url : baseUrl + 'categories/' + locale + '/1'`

### Get all product by categoryId (GET)
`url : baseUrl + 'products/' + locale + '/' + categoryId`


### Get all takeaways by date (GET)
`url : baseUrl + 'takeaways/' + {from} + '/' + {to}`

### Get takeaway by takeawayId (GET)
`url : baseUrl + 'takeaway/' + {takeawayId}`


### Open table (POST)
`url : baseUrl + 'openTable'`  
**data eg:** `{ "tableID" : tableID, "checkout" : 0 }`

### Change turnover status (POST)
`url : baseUrl + 'turnover'`  
**data eg:** `{ "id" : id, "checkout" : true, "tableId" : tableID }`


### Take order (POST)
`url : baseUrl + 'orders/' + turnoverId + '/' + (true/false for print)`  
**data eg:**
`[{  
	"count": 1,
	"product": {
		"id": 100,
		"categoryId": 16
	},
	"orderAttributions": null
}]`

### Change order (POST)
`url : baseUrl + 'orders/' + turnoverId + '/' + (true/false for print)`
**data eg:**
`[{
    "id": 888,
	"count": -1,
	"product": {
		"id": 100,
		"categoryId": 16
	},
	"orderAttributions": null
}]`

### New take away (POST)
`url : baseUrl + 'takeaway/'`  
**data eg:** `{"memo":"abcd","takeaway":"false"}`  
**return:** `{ "model": {
        "turnover": {
            "firstTableId": 0,
            "tableId": 0,
            "discount": null,
            "takeawayId": 14,
            "created": null,
            "updated": null,
            "payment": null,
            "checkout": false,
            "id": 166
        },
        "takeaway": false,
        "created": null,
        "updated": null,
        "memo": "abcd",
        "id": 14
    },
    "exception": null}`
