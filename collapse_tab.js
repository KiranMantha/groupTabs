(function () {
  var storedData = [],
    loadedTabs = [],
    schema = {},
    ajv = null;

  function loadTabs() {
    loadedTabs = [];
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
          a.setAttribute("target", "_blank");
          addClass(span, ["close", "gt-times"]);
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
    var pgc = e.target.parentElement.parentElement.parentElement;
    toggleClass(pgc, 'in');
    toggleClass(e.target, ['gt-chevron-down', 'gt-chevron-up']);
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
    var downloadBtn = byId('btnImport');
    chrome.storage.local.get(["groupedtabs"], function (data) {
      var lstGroups = byId("lstGroups"),
        docfrag = document.createDocumentFragment();
      lstGroups.innerHTML = "";

      if (data.groupedtabs && data.groupedtabs.length > 0) {
        hasDataInStorage = true;
        storedData = data.groupedtabs;
        try {
          storedData.forEach(function (group, i) {
            var groupcontainer = createEl("div"),
              h3 = createEl("h3"),
              ollistcontainer = createEl("ol"),
              openicon = createEl("i"),
              toggleicon = createEl("i"),
              deleteicon = createEl("i"),
              iconContainer = createEl('span');

            addClass(groupcontainer, "groupcontainer");
            addClass(ollistcontainer, "tabsList");
            addClass(openicon, ['fa', 'gt-external-link']);
            openicon.setAttribute('title', 'Open group in new window');
            openicon.groupedtabs = group.tablist;
            openicon.onclick = openGroupedTabs;
            addClass(toggleicon, ['fa', 'gt-chevron-down']);
            toggleicon.setAttribute('title', 'View');
            toggleicon.onclick = onToggleIconClick;
            addClass(deleteicon, ['fa', 'gt-trash']);
            deleteicon.setAttribute('title', 'Delete Group');
            deleteicon.groupindex = i;
            deleteicon.onclick = deleteSavedGroup;

            appendChild(iconContainer, openicon, deleteicon, toggleicon);
            addClass(h3, "groupheader");
            h3.textContent = group.name;
            appendChild(h3, iconContainer);

            for (var tab of group.tablist) {
              var li = createEl("li"),
                a = createEl("a");

              a.textContent = tab.title;
              a.setAttribute("href", tab.url);
              a.setAttribute("target", "_blank");
              li.setAttribute("title", tab.title);
              appendChild(li, a);
              appendChild(ollistcontainer, li);
            }
            appendChild(groupcontainer, h3, ollistcontainer);
            appendChild(docfrag, groupcontainer);
          });
          downloadBtn.removeAttribute('disabled');
        } catch (e) {
          var errorDiv = createEl("div");
          errorDiv.textContent = "No Saved Groups Found.";
          addClass(errorDiv, 'norecords');
          appendChild(docfrag, errorDiv);
        }
      } else {
        var errorDiv = createEl("div");
        errorDiv.textContent = "No Saved Groups Found.";
        addClass(errorDiv, 'norecords');
        appendChild(docfrag, errorDiv);
        downloadBtn.setAttribute('disabled', 'disabled');
      }
      appendChild(lstGroups, docfrag);
    });
  }

  function editGroup(groupid) {

  }

  function getPageMeta(pageurl) {
    chrome.runtime.sendMessage(
      {
        contentScriptQuery: 'fetchUrl',
        url: 'http://url-metadata.herokuapp.com/api/metadata?url=' + pageurl
      },
      function (response) {

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
    }, false);

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
        chrome.storage.sync.set({ groupedtabs: storedData });
        loadedTabs = [];
        txtgroupname.value = "";
        var groupDiv = document.querySelector("[data-tabname='tablist']");
        groupDiv.click();
      } else {
        addClass(txtgroupname, 'error');
      }
    }, false);
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
          tabName === 'importexport' && resetExportImport();
        }
      }, false);
    }
  }

  function download(content, contentType) {
    var a = document.createElement("a");
    content = JSON.stringify(content, null, '\t');
    var file = new Blob([content], {
      type: contentType
    });
    a.setAttribute('href', URL.createObjectURL(file));
    a.setAttribute('target', '_blank');
    a.setAttribute('download', 'groupTabs-' + (new Date()).getTime() + '.json');
    a.click();
  }

  function exportImport() {
    byId('btnImport').addEventListener('click', function () {
      chrome.storage.local.get(["groupedtabs"], function (data) {
        download(data, 'application/json');
      });
    }, false);
    byId('inptFile').addEventListener('change', function (e) {
      resetExportImport();
      var input = e.target,
        divmsg = byId('divmsg'),
        reader = new FileReader(),
        extension = null,
        json = {},
        valid = false;

      if (input.files && input.files[0]) {
        byId('lblFile').innerHTML = input.files[0].name;
        extension = input.files[0].name.split('.');
        extension = extension[extension.length - 1];
        if (extension === 'json') {
          reader.readAsText(input.files[0]);
          reader.onload = function (evt) {
            json = JSON.parse(evt.target.result);
            // valid = validateJSON(json);
            valid = validateSchema(json);
            if (valid) {
              chrome.storage.local.set(json);
              byId('lblFile').innerHTML = 'Choose File To Upload';
              addClass(divmsg, 'success');
              divmsg.innerHTML = 'Groups uploaded successfully.';
            } else {
              errorInFileUpload();
            }
          }
          input.files = null;
          input.value = '';
        } else {
          errorInFileUpload();
        }
      }
    }, false);
  }

  function errorInFileUpload() {
    var divmsg = byId('divmsg');
    byId('lblFile').innerHTML = 'Choose File To Upload';
    addClass(divmsg, 'error');
    divmsg.innerHTML = 'Please upload valid JSON file.';
  }

  function resetExportImport() {
    var divmsg = byId('divmsg');
    byId('lblFile').innerHTML = 'Choose File To Upload';
    removeClass(divmsg, ['error', 'success']);
    divmsg.innerHTML = '';
  }

  function validateJSON(json) {
    ajv = new Ajv();
    return ajv.validate(schema, json);
  }

  function getSyncData() {
    chrome.storage.sync.get(['groupedtabs'], function (data) {
      chrome.storage.local.set({
        groupedtabs: data.groupedtabs
      });
      loadSavedGroups();
    });
  }

  function init() {
    document.addEventListener('DOMContentLoaded', function () {
      var schemaurl = chrome.runtime.getURL('schema.json');
      fetch(schemaurl).then(function (res) {
        return res.json();
      }).then(function (_schema) {
        schema = _schema;
      });
      getSyncData();
      bindClick();
      toggleTabs();
      loadTabs();
      loadSavedGroups();
      exportImport();
      chrome.storage.onChanged.addListener(function (changes) {
        loadSavedGroups();
      });
    });
  }

  init();
})();