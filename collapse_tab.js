(function () {
  var storedData = [];
  var loadedTabs = [];

  function loadTabs() {
    chrome.tabs.query({
        currentWindow: true
      },
      function (btabs) {
        loadedTabs = loadedTabs.concat(btabs);        
        var ol = byId("olTabsList");
        ol.innerHTML = "";
        var k = document.createDocumentFragment();
        for (var tab of btabs) {
          var li = createEl("li"),
            a = createEl("a"),
            span = createEl("span");

          a.textContent = tab.title;
          a.setAttribute("href", tab.url);
          addClass(span, ["close", "fa", "fa-times"]);
          span.setAttribute("title", "Remove");
          span.setAttribute("data-tabid", tab.id);
          li.setAttribute("title", tab.title);
          appendChild(li, a, span);
          appendChild(k, li);
        }
        ol.appendChild(k);
      }
    );
  }

  function onToggleIconClick(e) {
    var pgc = e.target.parentElement.parentElement;
    toggleClass(pgc, 'in');
    toggleClass(e.target, ['fa-chevron-down', 'fa-chevron-up']);
  }

  function openGroupedTabs(e) {
    var tabs = e.target.groupedtabs,
      urls = [];
    for (var tab of tabs) {
      urls.push(tab.url);
    }
    chrome.windows.create({
      url: urls
    });
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
      var lstGroups = byId("lstGroups"),
        docfrag = document.createDocumentFragment();
      lstGroups.innerHTML = "";

      if (data.groupedtabs && data.groupedtabs.length > 0) {
        hasDataInStorage = true;
        storedData = data.groupedtabs;
        storedData.forEach(function (group, i) {
          var groupcontainer = createEl("div"),
            h3 = createEl("h3"),
            ollistcontainer = createEl("ol"),
            openicon = createEl("i"),
            toggleicon = createEl("i"),
            deleteicon = createEl("i");

          addClass(groupcontainer, "groupcontainer");
          addClass(ollistcontainer, "tabsList");
          addClass(openicon, ['fa', 'fa-sign-out']);
          openicon.setAttribute('title', 'Open Group');
          openicon.groupedtabs = group.tablist;
          openicon.onclick = openGroupedTabs;
          addClass(toggleicon, ['fa', 'fa-chevron-down']);
          toggleicon.setAttribute('title', 'View');
          toggleicon.onclick = onToggleIconClick;
          addClass(deleteicon, ['fa', 'fa-trash']);
          deleteicon.setAttribute('title', 'Delete Group');
          deleteicon.groupindex = i;
          deleteicon.onclick = deleteSavedGroup;

          addClass(h3, "groupheader");
          h3.textContent = group.name;
          appendChild(h3, openicon, deleteicon, toggleicon);

          for (var tab of group.tablist) {
            var li = createEl("li"),
              a = createEl("a");

            a.textContent = tab.title;
            a.setAttribute("href", tab.url);
            li.setAttribute("title", tab.title);
            appendChild(li, a);
            appendChild(ollistcontainer, li);
          }
          appendChild(groupcontainer, h3, ollistcontainer);
          appendChild(docfrag, groupcontainer);
        });
      } else {
        var errorDiv = createEl("div");
        errorDiv.textContent = "No Saved Groups Found.";
        addClass(errorDiv, 'norecords');
        appendChild(docfrag, errorDiv);
      }
      appendChild(lstGroups, docfrag);
    });
  }

  function bindClick() {
    var ol = byId("olTabsList"),
      savebtn = byId("btnSaveGroup"),
      txtgroupname = byId("txtGroupName");

    ol.addEventListener("click", function (e) {
      if (hasClass(e.target, "close")) {
        //removeTab(e.target.getAttribute("data-tabid"));
        var tabid = parseInt(e.target.getAttribute("data-tabid"));
        remove(ol, e.target.parentNode);
        var delTabIndex = loadedTabs.map(function (tab) {
          return tab.id
        }).indexOf(tabid);
        loadedTabs.splice(delTabIndex, 1);
      }
    });

    savebtn.addEventListener("click", function () {
      hasClass(txtgroupname, 'error') && removeClass(txtgroupname, 'error');
      if (txtgroupname.value && loadedTabs.length > 0) {
        var tabs = [];
        loadedTabs.forEach(function (tab) {
          tabs.push({
            title: tab.title,
            url: tab.url
          });
        });
        storedData.push({
          name: txtgroupname.value,
          tablist: tabs
        });
        chrome.storage.local.set({
          groupedtabs: storedData
        });
        loadedTabs = [];
        txtgroupname.value = "";
        var groupDiv = document.querySelector("[data-tabname='tablist']");
        groupDiv.click();
      } else {
        addClass(txtgroupname, 'error');
      }
    });
  }

  function removeTab(index) {
    chrome.tabs.remove(parseInt(index));
  }

  function toggleTabs() {
    var sourceCDOM = byClass('.tabs');

    for (var sourceC of sourceCDOM) {
      sourceC.addEventListener("click", function (e) {
        if (!hasClass(e.target, "active")) {
          sourceC.querySelectorAll(".active").forEach(function (node) {
            removeClass(node, "active");
            var i = Array.prototype.indexOf.call(sourceC.children, node);
            removeClass(sourceC.nextElementSibling.children[i], "active");
          });
          addClass(e.target, "active");
          var index = Array.prototype.indexOf.call(
            sourceC.children,
            e.target
          );
          addClass(sourceC.nextElementSibling.children[index], "active");
          var tabName = e.target.getAttribute('data-tabname');
          tabName === 'add' && loadTabs();
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
      chrome.storage.onChanged.addListener(function (changes) {
        loadSavedGroups();
      });
    });
  }

  init();
})();