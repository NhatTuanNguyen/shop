$(document).ready(async function (e) {
    let a = $("ol.breadcrumb .breadcrumb-item:eq(1)").text();
    $(".primary-menu .menu-container li.menulv1").each(function() {
        let b = $(this).find("a:first div").text();
        if(a==b){
            $(this).addClass("current");
        }
        if(a=='' && b=='Home') {
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
                    $('.yourcart').find('.top-cart-items').html(html);
                }
                $('.top-cart-number').text(response.length);
                $('.total-price').text('$'+Math.round(totalPrice * 100) / 100 );
                if(alert){
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: 'Thêm vào giỏ hàng thành công',
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
                    }
                }
            }
        });
    }

    $('.add-cart').click(function(e){
        e.preventDefault();
        
        var url = $(this).attr('href');
        var id = $(this).attr('data-id');
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
            if(!checkIdSample) data.push({id,amount: 1});
        } else {
            data.push({id,amount: 1});
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
            if(!checkIdSample) data.push({id,amount});
        } else {
            data.push({id,amount});
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
        } else $('.table.cart').replaceWith( "<h2 class='text-center'>Your cart is empty</h2>");

        

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
    
});

