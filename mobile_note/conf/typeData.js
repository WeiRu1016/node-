module.exports = [{
        type: 'in',
        typeName: '收入',
        subType: [
            { type: 'in', typeName: '收入' }
        ]
    },
    {
        type: 'out',
        typeName: '支出',
        subType: [
            { type: 'cloth', typeName: '衣服' },
            { type: 'food', typeName: '饮食' },
            { type: 'house', typeName: '住宿' },
            { type: 'traffic', typeName: '交通' },
            { type: 'buy', typeName: '购物' },
            { type: 'other', typeName: '其他' }
        ]
    }
];