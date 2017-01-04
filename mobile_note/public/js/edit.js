var typeList = document.getElementsByClassName('type-list')[0],
    calculator = document.getElementById('calculator'),
    thead = calculator.getElementsByTagName('thead')[0],
    tbody = calculator.getElementsByTagName('tbody')[0],
    liList = typeList.getElementsByClassName('type-item'),
    calType = document.getElementById('cal-type'),
    calResult = document.getElementById('cal-result'),
    calNumber = tbody.getElementsByTagName('td'),
    calDone = tbody.getElementsByClassName('calc-ok')[0];

var nowSelectType = {
    type: '',
    subtype: '',
    typeName: ''
};
var nowMoney = 0,
    opreation = '',
    firstNumber = 0,
    secondNumber = 0,
    flag = 1;

function inputHandle(event) {
    var target = event.target;
    if (target.value.length > 11) {
        event.preventDefault();
    }
};

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

[].slice.call(liList).forEach(function(ele, index) {
    touchEvent(ele, function(node) {
        if (!calculator.style.display || calculator.style.display == "none") {
            calculator.style.display = "table";
        }
        var type = node.dataset.type,
            subtype = node.dataset.subtype,
            typeName = node.dataset.typename;
        calType.className = 'icon-' + subtype + ' icon-round icon-middle icon';
        calType.dataset.type = type;
        calType.dataset.subtype = subtype;
        calType.nextElementSibling.innerText = typeName;
        nowSelectType.type = type;
        nowSelectType.subtype = subtype;
        nowSelectType.typeName = typeName;
    });
});
[].slice.call(calNumber).forEach(function(ele, index) {
    touchEvent(ele, function(node) {
        var className = node.className;
        switch (className) {
            case 'calc-add':
                opreation = '+';
                calDone.innerText = "=";
                break;
            case 'calc-sub':
                opreation = '-';
                calDone.innerText = "=";
                break;
            case 'calc-ok':
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
                } else if (flag == 1) {
                    nowMoney = parseFloat(firstNumber);
                    submitMoney(nowSelectType, nowMoney);
                }
                break;
            case 'calc-backspack':
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

function submitMoney(typeObj, money) {
    myAjax({
        type: 'post',
        url: '../../edit',
        data: {
            type: typeObj.type,
            category: typeObj.subtype,
            typeName: typeObj.typeName,
            money: money
        },
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
        // data = [];
        data = '';
        for (k in obj.data) {
            data += k + '=' + obj.data[k] + '&';
            // data.push(encodeURIComponent(k) + '=' + encodeURIComponent(obj.data[k]));
        }
        data = data.slice(0, -1);
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                obj.success(xhr.responseText);
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
// [].slice.call(calTd).forEach(function(ele, index) {
//     touchEvent(ele, function(node) {

//     });
// });