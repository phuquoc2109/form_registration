
function Validator(options){

    var selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;
        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        // Lặp qua từng rule & ktra
        // Nếu có lỗi thì dừng ktra
        for( var i = 0; i< rules.length; ++i){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }
        
        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        } 
        return !errorMessage;
    }
    
    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);

    if(formElement){
        // Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rules và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });

            if(isFormValid){
                if (typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        return (values[input.name] = input.value) && values;
                    }, {});
                   
                    options.onSubmit(formValues);
                }
            }
        }


        // Lặp qua mỗi rule và xử lý (blur, input, ...)
        options.rules.forEach(function (rule) {

            // Lưu lại các rules cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector] = [rule.test];
            }
            
            var inputElement = formElement.querySelector(rule.selector);
           
            if(inputElement) {
                // Trường hợp blur ra khỏi input
                inputElement.onblur = function () {
                   validate(inputElement, rule);   
                }

                // Trường hợp nhập vào input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                } 
            }
        });    
    }
}

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message ||  'Vui lòng nhập trường này !!!'
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function(value){
            var regex =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;            
            return regex.test(value) ? undefined : message ||  'Trường này phải là email';
        }
    }
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : message || `Vui lòng nhập vào tối thiểu ${min} kí tự`;
        }
    }
}

Validator.isConfirmed = function (selector, getCofirmValue, message) {
    return {
        selector : selector,
        test: function (value) {
            return value === getCofirmValue() ? undefined : message || 'Giá trị nhập vao không chính xác';
        }
    }
}