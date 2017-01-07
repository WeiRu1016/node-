var typeList = document.querySelector('.type-list'),
    typeItem = document.querySelectorAll('.type-list .type-item'),
    calNumber = document.querySelectorAll('tbody td'),
    calculator = document.getElementById('calculator'),
    calType = document.getElementById('cal-type'),
    calResult = document.getElementById('cal-result'),
    calDone = document.getElementById('cal-done'),
    itemId = document.getElementById('item-id') ? document.getElementById('item-id').value : '',
    itemDate = document.getElementById('item-date') ? document.getElementById('item-date').value : '';

var submitType = calDone.dataset.type;
var nowMoney = 0,
    opreation = '',
    firstNumber = 0,
    secondNumber = 0,
    flag = 1;

function touchEvent(node, callback) {
    var is_move, finger;
    node.addEventListener('touchstart', function(e) {
        is_move = false;
        finger = e.touches.length;
        e.stopPropagation();
    });
    node.addEventListener('touchmove', function(e) {
        is_move = true;
        e.stopPropagation();
    });
    node.addEventListener('touchend', function(e) {
        if (is_move || finger > 1) {
            e.stopPropagation();
            return;
        }
        callback(node);
    });
    node.addEventListener('touchcancel', function(e) {
        e.stopPropagation();
        return;
    });
};

[].slice.call(typeItem).forEach(function(ele, index) {
    touchEvent(ele, function(node) {
        if (!calculator.style.display || calculator.style.display == "none") {
            calculator.style.display = "table";
            typeList.style.paddingBottom = "300px";
        }
        var type = node.dataset.type,
            subtype = node.dataset.subtype,
            typeName = node.dataset.typename;
        calType.className = 'icon-' + subtype + ' icon-round icon-middle icon';
        calType.dataset.type = type;
        calType.dataset.subtype = subtype;
        calType.dataset.typename = typeName;
        calType.nextElementSibling.innerText = typeName;
    });
});
[].slice.call(calNumber).forEach(function(ele, index) {
    touchEvent(ele, function(node) {
        var className = node.dataset.type;
        switch (className) {
            case 'opreation-add':
                opreation = '+';
                calDone.innerText = "=";
                calDone.dataset.type = "equal";
                break;
            case 'opreation-sub':
                opreation = '-';
                calDone.innerText = "=";
                calDone.dataset.type = "equal";
                break;
            case 'equal':
                if (flag == 2) {
                    if (opreation == "+") {
                        nowMoney = parseFloat(firstNumber) + parseFloat(secondNumber);
                    } else if (opreation == "-") {
                        nowMoney = parseFloat(firstNumber) - parseFloat(secondNumber);
                    }
                    opreation = '';
                    firstNumber = nowMoney;
                    secondNumber = 0;
                    flag = 1;
                    calDone.innerText = "OK";
                    calDone.dataset.type = submitType;
                }
                break;
            case 'submit-add':
                submitHandler('../../edit/add', {
                    type: calType.dataset.type,
                    category: calType.dataset.subtype,
                    typeName: calType.dataset.typename,
                    money: calResult.innerText
                });
                break;
            case 'submit-change':
                submitHandler('../../edit/change', {
                    id: itemId,
                    date: itemDate,
                    type: calType.dataset.type,
                    category: calType.dataset.subtype,
                    typeName: calType.dataset.typename,
                    money: calResult.innerText
                });
                break;
            case 'backspace':
                //未选择操作符
                if (!opreation) {
                    firstNumber = firstNumber.toString().slice(0, -1);
                    if (firstNumber.toString().length == 0) {
                        flag = 1;
                        opreation = '';
                        firstNumber = 0;
                        secondNumber = 0;
                        nowMoney = 0;
                    }
                } else {
                    if (flag == 1) {
                        opreation = '';
                        firstNumber = firstNumber.toString().slice(0, -1);
                        if (firstNumber.toString().length == 0) {
                            flag = 1;
                            opreation = '';
                            firstNumber = 0;
                            secondNumber = 0;
                            nowMoney = 0;
                        }
                    } else if (flag == 2) {
                        secondNumber = secondNumber.toString().slice(0, -1);
                        if (secondNumber.toString().length == 0) {
                            flag = 1;
                            opreation = '';
                            secondNumber = 0;
                            firstNumber = 0;
                            nowMoney = 0;
                        }
                    }
                }
                break;
            case 'number':
                var no = node.innerText;
                if (!opreation && flag == 1) {
                    if (firstNumber.toString().indexOf('.') == -1) {
                        firstNumber = parseFloat(firstNumber) == 0 ? no : firstNumber.toString() + no;
                    } else {
                        firstNumber = firstNumber.toString() + no;
                    }
                } else {
                    if (secondNumber.toString().indexOf('.') == -1) {
                        secondNumber = parseFloat(secondNumber) == 0 ? no : secondNumber.toString() + no;
                    } else {
                        secondNumber = secondNumber.toString() + no;
                    }
                    flag = 2;
                }
                break;
            case 'dot':
                if (!opreation) {
                    if (firstNumber.toString().indexOf('.') == -1) {
                        firstNumber = firstNumber.toString() + '.';
                    }
                } else {
                    if (secondNumber.toString().indexOf('.') == -1) {
                        secondNumber = secondNumber.toString() + '.';
                    }
                    flag = 2;
                }
                break;
        }
        if (flag == 1) {
            calResult.innerText = firstNumber;
        } else {
            calResult.innerText = secondNumber;
        }
    });
});

function submitHandler(url, data) {
    myAjax({
        type: 'post',
        url: url,
        data: data,
        success: function(data) {
            console.log(data);
            alert(data);
            if (data.code === 200) {
                window.location.href = '/';
            }
        },
        error: function() {

        }

    });
}
/*type, url, data, success,error */
function myAjax(obj) {
    var xhr = new XMLHttpRequest();
    var url = obj.url;
    var data = null;
    if (obj.type == 'get') {
        if (obj.data) {
            url += url.indexOf('?') == -1 ? '?' : '&';
            for (k in obj.data) {
                url += k + '=' + obj.data[k] + '&';
            }
            url = url.slice(0, -1);
        }
    } else if (obj.type == 'post') {
        data = '';
        for (k in obj.data) {
            data += k + '=' + obj.data[k] + '&';
        }
        data = data.slice(0, -1);
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                obj.success(JSON.parse(xhr.responseText));
            } else {
                obj.error(new Error);
            }
        }
    }
    console.log(data);
    xhr.open(obj.type, url, false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data);
}