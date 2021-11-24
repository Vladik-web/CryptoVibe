document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".wrap");
  const buttons = document.querySelectorAll(".buttons button");

  const obg = [];
  var isResizeble = false;
  const get = async () => {
    wrap.textContent = "";
    await fetch("https://api.binance.com/api/v3/ticker/price")
      .then((data) => data.json())
      .then((data) =>
        data.filter((item) => {
          if (item.symbol.substr(item.symbol.length - 4) === "USDT") {
            return item;
          }
        })
      )
      .then((data) =>
        data.map((item) => {
          let correctPrice = item.price.split(".");
										
										
										return {
            symbol: item.symbol,
            price: correctPrice[0].length > 3 
												? correctPrice[0] + "." + correctPrice[1].substr(0, 2) 
												: correctPrice[0] + "." + correctPrice[1].substr(0, 3)
          };
        })
      )
      .then((data) => {
        //режим массив
								console.log(data);
        let newMass = data.slice(0, 30);
        newMass.forEach((item, index) => {
          //инициализация
          if (!isResizeble) {
            newMass.forEach((item, index) => {
              obg.push({
                id: index,
                old: item.price,
              });
            });

            isResizeble = true;
          }

          const elems = `
                    <div class ="item ${
            item.price > obg[index].old ? "green" : "red"
          }" 
                      
                      data-id="${obg[index].id}">
                        <p>${item.symbol}</p>

                        <div class ="price">
                          <p class="newPrice">${item.price}</p>
                          <span class="oldPrice">${obg[index].old}</span>
                        </div>
                    </div>
                    `;
          obg[index].old = item.price;

          wrap.insertAdjacentHTML("beforeend", elems);
        });
      });
  };
  get();
  /* btns */
  const btns = [".reload-one", ".reload-inf", ".reload-stop"];

  const inf = document.querySelector(btns[1]);

  let interval;
  buttons.forEach((item) => {
    item.addEventListener("click", (e) => {
      const target = e.target.closest("button");
      if (target.closest(btns[0])) {
        get();
      } else if (target.closest(btns[1])) {
        inf.classList.add("active");
        interval = setInterval(function () {
          wrap.textContent = "";
          get();
        }, 2000);
      } else {
        clearInterval(interval);
        inf.classList.remove("active");
      }
    });
  });
});
