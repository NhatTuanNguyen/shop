$(document).ready(async function (e) {
    let a = $("ol.breadcrumb .breadcrumb-item:eq(1)").text();
    $(".primary-menu .menu-container li.menulv1").each(function() {
        let b = $(this).find("a:first div").text();
        if(a==b){
            $(this).addClass("current");
        }
        if(a=='' && b=='Home'&& window.location.pathname=='/') {
            $(this).addClass("current");
        }
    });
    // Save cart to localStorage
    const ajaxShowCart =async (link,data,alert=false,checkYourCart=false) => {
        await $.ajax({
            type: "post",
            url: link,
            data:data,
            dataType: "json",
            success: function (response) {
                items = JSON.parse(localStorage.getItem('cart'));
                for (var i = 0; i < response.length; i++) {
                    response[i].amount = items[i].amount;
                }
               
                var html ='';
                var cartHtml = '';
                var productOrderHtml = '';
                var totalPrice = 0;
                if(response.length >0){
                    response.forEach(function (item) {
                        html += `<div class="top-cart-item">
                        <div class="top-cart-item-image">
                        <a href="#"><img src="/uploads/products/${item.thumb}"
                                alt="Photo" /></a>
                    </div>
                    <div class="top-cart-item-desc">
                        <div class="top-cart-item-desc-title">
                            <a href="/${item.slug+'/'+item._id}">${item.name}</a>
                            <span class="top-cart-item-price d-block">$${item.reduce_price}</span>
                        </div>
                        <div class="top-cart-item-quantity">x ${item.amount}</div>
                    </div></div>`;

                        cartHtml += `<tr class="cart_item">
						<td class="cart-product-remove">
							<a href="#" data-id="${item._id}" class="remove" title="Remove this item"><i class="icon-trash2"></i></a>
						</td>
						<td class="cart-product-thumbnail">
							<a href="#"><img width="64" height="64" src="/uploads/products/${item.thumb}"
									alt="Photo"></a>
						</td>
						<td class="cart-product-name" style='width:300px'>
							<a href="/${item.slug+'/'+item._id}">${item.name}</a>
						</td>
						<td class="cart-product-price">
							<span class="amount">$${item.reduce_price}</span>
						</td>
						<td class="cart-product-quantity">
							<div class="quantity">
								<input type="button" value="-" class="minus">
								<input type="text" data-id="${item._id}" name="quantity" value="${item.amount}" class="qty" />
								<input type="button" value="+" class="plus">
							</div>
						</td>
						<td class="cart-product-subtotal">
							<span class="amount">$${item.amount*item.reduce_price}</span>
						</td>
					</tr>`;
                        productOrderHtml += `<tr class="cart_item">
                        <td class="cart-product-thumbnail">
                            <a href="#"><img width="64" height="64"
                                    src="/uploads/products/${item.thumb}" alt="Photo"></a>
                        </td>

                        <td class="cart-product-name">
                            <a href="/${item.slug+'/'+item._id}">${item.name}</a>
                        </td>

                        <td class="cart-product-quantity">
                            <div class="quantity clearfix">
                                1x${item.amount}
                            </div>
                        </td>

                        <td class="cart-product-subtotal">
                            <span class="amount">$${item.amount*item.reduce_price}</span>
                        </td>
                    </tr>`;
                    totalPrice += item.amount*item.reduce_price;

                    });
                    
                } else html = `<p class="text-center m-0">No product</p>`;
                
                $('.yourcart').find('.top-cart-items').html(html);
                $('.top-cart-number').text(response.length);
                $('.total-price').text('$'+Math.round(totalPrice * 100) / 100 );
                if(alert){
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: 'Th??m v??o gi??? h??ng th??nh c??ng',
                        animation: true,
                        position: 'top-left',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    });
                }
                if($('.table.cart:not(.checkout)').length > 0 && checkYourCart) {
                    if(response.length==0){
                        $('.table.cart').replaceWith( "<h2 class='text-center'>Your cart is empty</h2>");
                        $('.navigation-button').css('display','none');
                    } else {
                        $('.table.cart tbody').prepend(cartHtml);
                        $('.amount.color.lead strong').text('$'+Math.round(totalPrice * 100) / 100 );
                    }
                }
                if($('.table.cart.checkout').length > 0) {
                    if(response.length==0){
                        $('.table.cart:eq(1)').replaceWith( "<h2 class='text-center'>Your cart is empty</h2>");
                    } else {
                        $('.table.cart:eq(1) tbody').prepend(productOrderHtml);
                        $('.subtotal .amount').text('$'+Math.round(totalPrice * 100) / 100);
                        var shipping = $('.shipping .amount').text().substring(1);
                        $('.amount.color.lead strong').text('$'+Math.round((totalPrice+parseFloat(shipping)) * 100) / 100 );
                    }
                }
            }
        });
    }

    $('.add-cart').click(function(e){
        e.preventDefault();
        
        var url = $(this).attr('href');
        var id = $(this).attr('data-id');
        var price = $(this).attr('data-price');
        var thumb = $(this).attr('data-thumb');
        var name = $(this).attr('data-name');
        var data = JSON.parse(localStorage.getItem("cart"));
        if(data == null) data=[] 
        
        if(data.length > 0){
            var checkIdSample = 0;
            for(var i = 0; i <data.length; i++){
                if(data[i].id == id){
                    checkIdSample = 1;
                    data[i].amount += 1;
                    break;
                }
            }
            if(!checkIdSample) data.push({id,amount: 1,name,price,thumb});
        } else {
            data.push({id,amount: 1,name,price,thumb});
        }
        localStorage.setItem('cart',JSON.stringify(data));
        ajaxShowCart(url,{'cart': localStorage.getItem('cart')},true)
    });
    $('.cart').submit((e)=>{
        e.preventDefault();
        var form = $('.cart');
        var actionUrl = form.attr('action');
        var amount = parseInt(form.find('input[name="amount"]').val());
        var id = form.find('input[name="id"]').val();
        var price = form.find('input[name="price"]').val();
        var thumb = form.find('input[name="thumb"]').val();
        var name = form.find('input[name="name"]').val();
        var data = JSON.parse(localStorage.getItem("cart"));
        if(data == null) data=[] 
        
        if(data.length > 0){
            var checkIdSample = 0;
            for(var i = 0; i <data.length; i++){
                if(data[i].id == id){
                    checkIdSample = 1;
                    data[i].amount += amount;
                    break;
                }
            }
            if(!checkIdSample) data.push({id,amount,name,price,thumb});
        } else {
            data.push({id,amount,name,price,thumb});
        }
        localStorage.setItem('cart',JSON.stringify(data));
        ajaxShowCart(actionUrl,{'cart': localStorage.getItem('cart')},true)
    });

    await ajaxShowCart('/cart',{'cart': localStorage.getItem('cart')},false,true);

    // Remove item from cart
    $('.remove').click(function(e){
        e.preventDefault();
        var data = JSON.parse(localStorage.getItem("cart"));
        var id = $(this).attr('data-id');
        var totalPrice=0;

        data = data.filter(function(value){
            return value.id !== id;
        });

        localStorage.setItem('cart',JSON.stringify(data));
        if($('.remove').length > 1){
            $(this).closest('.cart_item').remove();
        } else{
            $('.table.cart').replaceWith( "<h2 class='text-center'>Your cart is empty</h2>");
            $('.navigation-button').css('display','none');
        } 

        

        $('.cart-product-subtotal .amount').each(function(){
            totalPrice += parseFloat($(this).text().substring(1));
        });

        $('.amount.color.lead strong').text('$'+Math.round(totalPrice * 100) / 100);
        ajaxShowCart('/cart',{'cart': localStorage.getItem('cart')});
        
    });

    // increase or decrease the number of items
    $('td .quantity .plus').click(function(e){
        var quantity = $(this).closest('.quantity').find('.qty');
        quantity.val(parseInt(quantity.val())+1)
    });
    $('td .quantity .minus').click(function(e){
        var quantity = $(this).closest('.quantity').find('.qty');
        if(quantity.val()>1){
            quantity.val(parseInt(quantity.val())-1);
        }
    });

    $('.plus,.minus').click(function(e){
        var data = JSON.parse(localStorage.getItem("cart"));
        var quantity = $(this).closest('.quantity').find('.qty');
        var subtotal = quantity.closest('tr').find('.cart-product-subtotal .amount');
        var price = quantity.closest('tr').find('.cart-product-price .amount').text().substring(1);
        var id = quantity.attr('data-id');
        var totalPrice=0;

        data.forEach((item) => {
            if(item.id == id) item.amount = parseInt(quantity.val())
        });

        localStorage.setItem('cart',JSON.stringify(data));

        var total = parseFloat(price)*parseInt(quantity.val());
        subtotal.text('$'+Math.round(total * 100) / 100);

        $('.cart-product-subtotal .amount').each(function(){
            totalPrice += parseFloat($(this).text().substring(1));
        });

        $('.amount.color.lead strong').text('$'+Math.round(totalPrice * 100) / 100);
        ajaxShowCart('/cart',{'cart': localStorage.getItem('cart')});
    });

    // Apply coupon
    $('.apply-coupon').click(function(e){
        e.preventDefault();
        var currentTime = new Date().toISOString();
        let value = $(this).closest('.row').find('input').val();
        let url = $(this).attr('href');
        
        $.ajax({
            type: "get",
            url: url,
            data: {value},
            dataType: "json",
            success: function (response) {
                var subtotal = $('.subtotal .amount').text().substring(1);
                var shipping = $('.shipping .amount').text().substring(1);
                var totalPrice = parseFloat(shipping)+parseFloat(subtotal);
                if(!(Object.keys(response).length === 0 )&& 
                    currentTime<= response.endtime && 
                    currentTime >= response.starttime && 
                    response.amount-response.remain){

                    if(response.type == 'percent') {
                        discount = parseFloat(subtotal)*response.discount/100;
                        $('.discount').find('.amount').text('-$'+Math.round(discount * 100) / 100);
                        $('.amount.color.lead strong').text('$'+Math.round((totalPrice - discount) * 100) / 100 );
                        $('input[name="discount"]').val(Math.round(discount * 100) / 100);
                    } else {
                        $('.discount').find('.amount').text('-$'+response.discount);
                        $('.amount.color.lead strong').text('$'+Math.round((totalPrice - response.discount) * 100) / 100 );
                        $('input[name="discount"]').val(response.discount );
                    }
                    $('.discount').css('display', '');
                    $('p.notify').text('Apply Coupon success').css({'display': '','color': 'green'});
                    $('input[name="coupon"]').val(value);
                } else {
                    $('.discount').css('display', 'none');
                    $('.amount.color.lead strong').text('$'+totalPrice);
                    $('p.notify').text('Sorry this coupon is not valid or has expired').css({'display': '','color': 'red'});
                    $('input[name="discount"]').val(0);
                    $('input[name="coupon"]').val('');
                }
            }
        });
    });

    // Sort price
    if($('.sort-price').length >0){
        var url = $(location).attr('href').split('/');
        var sortOption = $('.sort-price').find('option');
        sortOption.eq(1).val('/'+url[3] + '/' + url[4].split('?')[0]);
        sortOption.eq(2).val('/'+url[3] +'/' + url[4].split('?')[0] + '?sort=desc');
        sortOption.eq(3).val('/'+url[3] +'/' + url[4].split('?')[0] + '?sort=asc');
    }
    $('.sort-price').find('select').change(function(){
        window.location = $(this).val();
    });

    // Load provinces of Viet Nam
    const optionsHtml =(data,name='')=>{
        var htmls
        if(name==''){
            htmls = data.map((item)=>{
                return `<option value="${item.name}">${item.name}</option>`
            });
        } else {
            htmls = data.map((item)=>{
                if(item.name == name) return `<option value="${item.name}" selected="selected">${item.name}</option>`
                return `<option value="${item.name}">${item.name}</option>`
            });
        }
        return htmls.join('');
    }

    if(window.location.pathname == '/cart/checkout' || window.location.pathname == '/profile'){
        var provincesData = []; 
        await fetch('https://provinces.open-api.vn/api/?depth=3')
            .then((response) => {
                return response.json()
            })
            .then((data) => provincesData = data)
            .catch((error) =>console.log(error));

        var html = '<option value="">Choose City</option>';
        var valueCity = $('select[name="city"]').attr('data-value');
        html += optionsHtml(provincesData,valueCity);
        $('select[name="city"]').html(html);

        var valueDistrict = $('select[name="district"]').attr('data-value');
        var valueWard = $('select[name="ward"]').attr('data-value');
        if(valueDistrict != ''){
            const district = provincesData.filter(item => item.name == valueCity)[0].districts;
            var htmlDistrict = '<option value="">Choose District</option>';
            htmlDistrict += optionsHtml(district,valueDistrict);
            $('select[name="district"]').html(htmlDistrict);

            const ward = district.filter(item => item.name == valueDistrict)[0].wards;
            var htmlWard = '<option value="">Choose Ward</option>';
            htmlWard += optionsHtml(ward,valueWard);
            $('select[name="ward"]').html(htmlWard);
        }
        

        $('select[name="city"]').change(function(){
            var cityName = $(this).val();

            const district = provincesData.filter(item => item.name == cityName)[0].districts;
            var htmlDistrict = '<option value="">Choose District</option>';
            htmlDistrict += optionsHtml(district);
            $('select[name="district"]').html(htmlDistrict);
            $('select[name="ward"]').html('<option value="">Choose Ward</option>');
        });

        $('select[name="district"]').change(function(){
            var cityName = $('select[name="city"]').val();
            var districtName = $(this).val();
            const district = provincesData.filter(item => item.name == cityName)[0].districts;
            const ward = district.filter(item => item.name == districtName)[0].wards;
            var htmlWard = '<option value="">Choose Ward</option>';
            htmlWard += optionsHtml(ward);
            $('select[name="ward"]').html(htmlWard);
        });

        // infomation products
        $('input[name="products"]').val(localStorage.getItem('cart'));
        
    }

    // Set validate Re-password
    if(window.location.pathname == '/auth/login'){
        function validatePassword(password,confirm_password){
            if(password.val() != confirm_password.val()) {
              confirm_password[0].setCustomValidity("Passwords Don't Match");
            } else {
              confirm_password[0].setCustomValidity('');
            }
          }

        var password = $('#register-password');
        var repassword = $('#repassword');
        password.change(function(){validatePassword(password,repassword)});
        repassword.keyup(function(){validatePassword(password,repassword)})
    }

    $('#checkout-form').submit(function(){
        localStorage.removeItem('cart');
    });
 
    // Active page profile
    var url = window.location.href;
    $(".nav li a").each(function() {
        if(this.href == url) $(this).parents('li').addClass('active');
    });
});

