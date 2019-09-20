(function () {
  var storedData = [];

  function loadTabs() {
    chrome.tabs.query({
        currentWindow: true
      },
      function (btabs) {
        var k = document.createDocumentFragment();
        for (var tab of btabs) {
          var li = document.createElement("li"),
            a = document.createElement("a"),
            span = document.createElement("span");

          a.textContent = tab.title;
          a.setAttribute("href", tab.url);
          span.classList.add("close", "fa", "fa-times");
          span.setAttribute("title", "Remove");
          span.setAttribute("data-tabid", tab.id);
          li.setAttribute("title", tab.title);

          li.appendChild(a);
          li.appendChild(span);
          k.appendChild(li);
        }
        var ol = document.getElementById("olTabsList");
        ol.innerHTML = "";
        ol.appendChild(k);
      }
    );
  }

  function onToggleIconClick(e) {
    var pgc = e.target.parentElement.parentElement;
    pgc.classList.toggle('in');
    e.target.classList.toggle('fa-chevron-down');
    e.target.classList.toggle('fa-chevron-up');
  }

  function openGroupedTabs(e) {
    var tabs = e.target.groupedtabs,
      urls = [];
    for (var tab of tabs) {
      urls.push(tab.url);
    }
    chrome.windows.create({ url: urls });
  }

  function deleteSavedGroup(e) {
    var i = e.target.groupindex;
    storedData.splice(i, 1);
    chrome.storage.local.set({
      groupedtabs: storedData
    });
  }

  function loadSavedGroups() {
    chrome.storage.local.get(["groupedtabs"], function (data) {
      var lstGroups = document.getElementById("lstGroups"),
        docfrag = document.createDocumentFragment();
      lstGroups.innerHTML = "";

      if (data.groupedtabs && data.groupedtabs.length > 0) {
        hasDataInStorage = true;
        storedData = data.groupedtabs;
        storedData.forEach(function (group, i) {
          var groupcontainer = document.createElement("div"),
            h3 = document.createElement("h3"),
            ollistcontainer = document.createElement("ol"),
            openicon = document.createElement("i"),
            toggleicon = document.createElement("i"),
            deleteicon = document.createElement("i");

          groupcontainer.classList.add("groupcontainer");
          ollistcontainer.classList.add("tabsList");
          openicon.classList.add('fa', 'fa-sign-out');
          openicon.setAttribute('title', 'Open Group');
          openicon.groupedtabs = group.tablist;
          openicon.onclick = openGroupedTabs;
          toggleicon.classList.add('fa', 'fa-chevron-down');
          toggleicon.setAttribute('title', 'View');
          toggleicon.onclick = onToggleIconClick;
          deleteicon.classList.add('fa', 'fa-trash');
          deleteicon.setAttribute('title', 'Delete Group');
          deleteicon.groupindex = i;
          deleteicon.onclick = deleteSavedGroup;

          h3.classList.add("groupheader");
          h3.textContent = group.name;

          h3.appendChild(openicon);
          h3.appendChild(deleteicon);
          h3.appendChild(toggleicon);

          for (var tab of group.tablist) {
            var li = document.createElement("li"),
              a = document.createElement("a");

            a.textContent = tab.title;
            a.setAttribute("href", tab.url);
            li.setAttribute("title", tab.title);
            li.appendChild(a);
            ollistcontainer.appendChild(li);
          }
          groupcontainer.appendChild(h3);
          groupcontainer.appendChild(ollistcontainer);
          docfrag.appendChild(groupcontainer);
        });
      } else {
        var errorDiv = document.createElement("div");
        errorDiv.textContent = "No Saved Groups Found.";
        errorDiv.classList.add('norecords');
        docfrag.appendChild(errorDiv);
      }
      lstGroups.appendChild(docfrag);
    });
  }

  function bindClick() {
    var ol = document.getElementById("olTabsList"),
      savebtn = document.getElementById("btnSaveGroup"),
      txtgroupname = document.getElementById("txtGroupName");

    ol.addEventListener("click", function (e) {
      if (e.target.classList.contains("close")) {
        removeTab(e.target.getAttribute("data-tabid"));
      }
    });

    savebtn.addEventListener("click", function () {
      if (txtgroupname.value) {
        chrome.tabs.query({
            currentWindow: true
          },
          function (btabs) {
            var tabs = [];
            for (var tab of btabs) {
              tabs.push({
                title: tab.title,
                url: tab.url
              });
            }
            storedData.push({
              name: txtgroupname.value,
              tablist: tabs
            });

            chrome.storage.local.set({
              groupedtabs: storedData
            }, function (
              data
            ) {
              console.log(data);
            });
            txtgroupname.value = "";
          }
        );
      }
    });
  }

  function removeTab(index) {
    chrome.tabs.remove(parseInt(index));
  }

  function toggleTabs() {
    var sourceCDOM = document.querySelectorAll('.tabs');

    for (var sourceC of sourceCDOM) {
      sourceC.addEventListener("click", function (e) {
        if (!e.target.classList.contains("active")) {
          sourceC.querySelectorAll(".active").forEach(function (node) {
            node.classList.remove("active");
            var i = Array.prototype.indexOf.call(sourceC.children, node);
            sourceC.nextElementSibling.children[i].classList.remove("active");
          });
          e.target.classList.add("active");
          var index = Array.prototype.indexOf.call(
            sourceC.children,
            e.target
          );
          sourceC.nextElementSibling.children[index].classList.add("active");
        }
      });
    }
  }

  function init() {
    document.addEventListener('DOMContentLoaded', function () {
      bindClick();
      toggleTabs();
      loadTabs();
      loadSavedGroups();
      chrome.tabs.onRemoved.addListener(function (tabid) {
        document
          .querySelector('#olTabsList span[data-tabid="' + tabid + '"]')
          .parentElement
          .remove();
      });

      chrome.storage.onChanged.addListener(function (changes) {
        loadSavedGroups();
      });
    });
  }

  init();
})();