const gridDivs = document.querySelectorAll(".grid div");
gridDivs.forEach(function (div) {
  div.addEventListener("click", async function () {
    let text;

    if (confirm("Er du sikker?") == true) {
      // Hent id-verdien fra bildets id-attributt
      localStorage.setItem("parti", div.getAttribute("dbid"));
      fetch(`/insertValue/${localStorage.getItem("parti")}`).then(
        (response) => {
          if (response.ok) {
            window.location.href = "/charts";
          } else {
            console.log("det virker ikke");
          }
        }
      );
    } else {
      text = "Du avbrøt!";
    }
  });
});
