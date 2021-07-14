var apt_price_list_app;

if(document.getElementById("apt_price_list_app")!==null){
    apt_price_list_app = new Vue({
        el:"#apt_price_list_app",
        data: {dong_list:dong_list,
            price_list:price_list,
            total_page:total_page,
            dong_value:dong_value,
            name_value:name_value
        },
        methods:{
            get_dong_list:function(){
                //소켓통신을 이용해서 동 리스트 보내달라고 호출
            },
            get_data_list:function(){
                //소켓통신을 이용해서 아파트 리스트를 보내달라고 호출
            }
        },
        mounted(){
            console.log("123")
            var $app = this;
            $app.$nextTick(function(){
                $app.get_dong_list();
                $app.get_data_list();
            });
        }
    });
}