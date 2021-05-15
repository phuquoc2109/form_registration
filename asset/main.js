
function Validator(options){

    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value);
                    if(errorMessage){
                        errorElement.innerText = errorMessage;
                        inputElement.parentElement.classList.add('invalid');
                    }else {
                        errorElement.innerText = '';
                        inputElement.parentElement.classList.remove('invalid');
                    } 
    }
    
    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);

    if(formElement){
        
        options.rules.forEach(function (rule) {

            var inputElement = formElement.querySelector(rule.selector);
           
            if(inputElement) {
                // Trường hợp blur ra khỏi input
                inputElement.onblur = function () {
                   validate(inputElement, rule);   
                }

                // Trường hợp nhập vào input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector('.form-message');
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                } 
            }
        });
    }
}

Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này !!!'
        }
    }
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function(value){
            var regex =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;            
            return regex.test(value) ? undefined : 'Trường này phải là email';
        }
    }
}

Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : `Vui lòng nhập vào tối thiểu ${min} kí tự`;
        }
    }
}