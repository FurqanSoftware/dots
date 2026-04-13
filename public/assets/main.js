$(function () {
  (function (window, $) {
    function makeCopyBtn(getText) {
      var $btn = $('<button class="btn-copy" title="Copy to clipboard"></button>');
      $btn.html('<i data-feather="copy"></i>');
      $btn.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var text = typeof getText === 'function' ? getText() : getText;
        navigator.clipboard.writeText(text).then(function () {
          $btn.html('<i data-feather="check"></i>');
          feather.replace({ width: 14, height: 14, 'stroke-width': 2 });
          setTimeout(function () {
            $btn.html('<i data-feather="copy"></i>');
            feather.replace({ width: 14, height: 14, 'stroke-width': 2 });
          }, 1500);
        });
      });
      return $btn;
    }

    var QUERIES = {
      a: {
        types: ["DOMAIN"],
        output: "table",
        fields: [
          {
            name: "address",
            type: "addr",
          },
          {
            name: "ttl",
            type: "time",
          },
        ],
      },
      aaaa: {
        types: ["DOMAIN"],
        output: "table",
        fields: [
          {
            name: "address",
            type: "addr",
          },
          {
            name: "ttl",
            type: "time",
          },
        ],
      },
      cname: {
        types: ["DOMAIN"],
        output: "table",
        fields: [
          {
            name: "data",
            type: "addr",
          },
          {
            name: "ttl",
            type: "time",
          },
        ],
      },
      mx: {
        types: ["DOMAIN"],
        output: "table",
        fields: [
          "priority",
          {
            name: "exchange",
            type: "addr",
          },
          {
            name: "ttl",
            type: "time",
          },
        ],
      },
      naptr: {
        types: ["DOMAIN"],
        output: "table",
        fields: [
          "order",
          "preference",
          "flags",
          "service",
          "regexp",
          {
            name: "ttl",
            type: "time",
          },
        ],
      },
      ns: {
        types: ["DOMAIN"],
        output: "table",
        fields: [
          {
            name: "data",
            type: "addr",
          },
          {
            name: "ttl",
            type: "time",
          },
        ],
      },
      ptr: {
        types: ["DOMAIN"],
        output: "table",
        fields: [
          "data",
          {
            name: "ttl",
            type: "time",
          },
        ],
      },
      soa: {
        types: ["DOMAIN"],
        output: "table",
        fields: [
          "primary",
          "admin",
          "serial",
          "refresh",
          "retry",
          "expiration",
          "minimum",
          {
            name: "ttl",
            type: "time",
          },
        ],
      },
      srv: {
        types: ["DOMAIN"],
        output: "table",
        fields: [
          "priority",
          "weight",
          "port",
          "target",
          {
            name: "ttl",
            type: "time",
          },
        ],
      },
      txt: {
        types: ["DOMAIN"],
        output: "table",
        fields: [
          "data",
          {
            name: "ttl",
            type: "time",
          },
        ],
      },
      tls: {
        types: ["DOMAIN", "IP"],
        output: "kvtable",
        fields: [
          { name: "subject", label: "Subject" },
          { name: "issuer", label: "Issuer" },
          { name: "validFrom", label: "Valid From" },
          { name: "validTo", label: "Valid To" },
          { name: "serialNumber", label: "Serial Number" },
          { name: "fingerprint", label: "Fingerprint" },
        ],
      },
      http: {
        types: ["DOMAIN", "IP"],
        output: "kvpre",
        fields: [
          { name: "url", label: "URL" },
          { name: "status", label: "Status" },
          { name: "server", label: "Server" },
          { name: "tls", label: "TLS" },
        ],
        preField: "rawHeaders",
      },
      rdns: {
        types: ["IP"],
        output: "table",
        fields: [
          {
            name: "address",
            type: "addr",
          },
        ],
      },
      whois: {
        types: ["DOMAIN", "IP"],
        output: "pre",
      },
      geo: {
        types: ["DOMAIN", "IP"],
        output: "map",
        fields: [],
      },
    };

    var map = new mapboxgl.Map({
      container: $("#geo .map")[0],
      style: "mapbox://styles/mapbox/streets-v11",
    });
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "top-right");

    var addrCur = null,
      typeCur = null;

    $(window).on("statechange", function () {
      var state = History.getState(),
        hash = state.hash.replace(/\?&_suid=.+$/, "");

      switch (hash) {
        case "/":
          $("#home").show().siblings().hide();
          $("#prompt form input[name=addr]").val("").focus();
          break;

        default:
          var parts = hash.split("/"),
            addr = parts[1],
            type = parts[2];

          var addrKind;
          if (
            addr.match(
              /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$|^((?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,5}(?::[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(?::[0-9A-Fa-f]{1,4}){1,3}|(?:[0-9A-Fa-f]{1,4}:){1,3}(?::[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(?::[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:(?::[0-9A-Fa-f]{1,4}){1,6}|:(?:(?::[0-9A-Fa-f]{1,4}){1,7}|:))$/,
            )
          ) {
            addrKind = "IP";
          } else if (
            addr.match(/^((?!-)[_A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/)
          ) {
            addrKind = "DOMAIN";
          } else {
            alert("404");
            break;
          }

          if (!type) {
            if (typeCur && QUERIES[typeCur].types.indexOf(addrKind) != -1) {
              History.replaceState(
                state.data,
                state.title,
                "/" + addr + "/" + typeCur,
              );
              return;
            }

            switch (addrKind) {
              case "IP":
                History.replaceState(
                  state.data,
                  state.title,
                  "/" + addr + "/rdns",
                );
                return;
              case "DOMAIN":
                History.replaceState(
                  state.data,
                  state.title,
                  "/" + addr + "/a",
                );
                return;
            }
          }

          var addrChg = addr != addrCur;
          addrCur = addr;
          typeCur = type;

          document.title = "Dots – " + addr;

          $("#prompt form input[name=addr]").val(addr).blur();

          $("#results .nav li")
            .removeClass("active")
            .filter("." + type)
            .addClass("active");
          if (addrChg) {
            $("#results .nav li a").each(function () {
              var $this = $(this),
                type = $this.text().toLowerCase();
              $this.attr("href", "/" + addr + "/" + type);
              $this.toggle(QUERIES[type].types.indexOf(addrKind) != -1);
            });
          }

          $("#" + type).addClass("loading");

          switch (QUERIES[type].output) {
            case "table":
            case "kvtable":
              $("#" + type + " table tbody").empty();
              break;

            case "kvpre":
              $("#" + type + " table tbody").empty();
              $("#" + type + " pre").html("");
              break;

            case "map":
              map.setZoom(2).setCenter([0, 0]);
              if (map.getLayer("markers")) {
                map.removeLayer("markers");
                map.removeSource("markersSource");
              }
              map.resize();

            case "pre":
              $("#" + type + " pre").html("");
              break;
          }

          $.post(
            "/",
            {
              type: type,
              addr: addr,
            },
            function (data) {
              $("#" + type).removeClass("loading");

              switch (QUERIES[type].output) {
                case "table":
                  $("#" + type + " table tbody").empty();
                  $.each(data.records, function (_, record) {
                    $("#" + type + " table tbody").append(
                      $("<tr></tr>").append(
                        $.map(QUERIES[type].fields, function (field) {
                          if (typeof field == "string") {
                            field = {
                              name: field,
                            };
                          }

                          var $td, val = record[field.name];
                          switch (field.type) {
                            case "addr":
                              $td = $("<td></td>").append(
                                $("<a></a>")
                                  .attr(
                                    "href",
                                    "/" + val.toLowerCase(),
                                  )
                                  .text(val),
                              );
                              break;

                            case "time":
                              $td = $("<td></td>").text(val);
                              break;

                            default:
                              $td = $("<td></td>").text(val);
                              break;
                          }
                          $td.append(makeCopyBtn(String(val)));
                          return $td[0];
                        }),
                      ),
                    );
                  });
                  feather.replace({ width: 14, height: 14, 'stroke-width': 2 });
                  break;

                case "kvtable":
                  $("#" + type + " table tbody").empty();
                  if (data.records.length > 0) {
                    var record = data.records[0];
                    $.each(QUERIES[type].fields, function (_, field) {
                      var val = record[field.name];
                      var $td = $("<td></td>").text(val);
                      $td.append(makeCopyBtn(String(val)));
                      $("#" + type + " table tbody").append(
                        $("<tr></tr>")
                          .append($("<th></th>").text(field.label))
                          .append($td),
                      );
                    });
                  }
                  feather.replace({ width: 14, height: 14, 'stroke-width': 2 });
                  break;

                case "kvpre":
                  $("#" + type + " table tbody").empty();
                  var $pre = $("#" + type + " pre");
                  $pre.html("");
                  $("#" + type + " .btn-copy-block").remove();
                  if (data.records.length > 0) {
                    var record = data.records[0];
                    $.each(QUERIES[type].fields, function (_, field) {
                      var val = record[field.name];
                      var $td = $("<td></td>").text(val);
                      $td.append(makeCopyBtn(String(val)));
                      $("#" + type + " table tbody").append(
                        $("<tr></tr>")
                          .append($("<th></th>").text(field.label))
                          .append($td),
                      );
                    });
                    var preText = record[QUERIES[type].preField] || "";
                    $pre.text(preText);
                    var $copyBlock = makeCopyBtn(function () { return $pre.text(); });
                    $copyBlock.addClass("btn-copy-block");
                    $pre.parent().css("position", "relative").append($copyBlock);
                  }
                  feather.replace({ width: 14, height: 14, 'stroke-width': 2 });
                  break;

                case "map":
                  data.records = $.grep(data.records, function (record) {
                    if (record.remove) {
                      return false;
                    }
                    record.addresses = [record.address];
                    $.each(data.records, function (_, other) {
                      if (record == other) {
                        return;
                      }
                      if (record.country == other.country) {
                        record.addresses.push(other.address);
                        other.remove = true;
                      }
                    });
                    return true;
                  });

                  map.setZoom(2).setCenter([0, 0]);
                  if (map.getLayer("markers")) {
                    map.removeLayer("markers");
                    map.removeSource("markersSource");
                  }

                  if (data.records.length == 0) {
                    break;
                  }

                  const markersSource = {
                    type: "geojson",
                    data: {
                      type: "FeatureCollection",
                      features: data.records.map((record) => ({
                        type: "Feature",
                        geometry: {
                          type: "Point",
                          coordinates: record.coordinates.reverse(),
                        },
                        properties: {
                          title: record.country,
                          description: record.addresses.join(", "),
                        },
                      })),
                    },
                  };

                  map.addSource("markersSource", markersSource);

                  map.addLayer({
                    id: "markers",
                    type: "circle",
                    source: "markersSource",
                    paint: {
                      "circle-radius": 6,
                      "circle-color": "#007cbf",
                    },
                  });

                  const bounds = data.records.reduce((b, record) => {
                    const coord = record.coordinates;
                    return b.extend(coord);
                  }, new mapboxgl.LngLatBounds());

                  map.fitBounds(bounds, { maxZoom: 2 });
                  map.resize();
                  break;

                case "pre":
                  var $pre = $("#" + type + " pre");
                  $pre.html("");
                  $("#" + type + " .btn-copy-block").remove();
                  var fullText = "";
                  $.each(data.records, function (_, record) {
                    fullText += record.data;
                  });
                  $pre.text(fullText);
                  var $copyBlock = makeCopyBtn(function () { return $pre.text(); });
                  $copyBlock.addClass("btn-copy-block");
                  $pre.parent().css("position", "relative").append($copyBlock);
                  feather.replace({ width: 14, height: 14, 'stroke-width': 2 });
                  break;
              }
            },
          );

          $("#results section")
            .hide()
            .filter("#" + type)
            .show();
          $("#results").show().siblings().hide();

          map.resize();
          break;
      }

      try {
        GoSquared.DefaultTracker.TrackView();
      } catch (e) {}
    });

    $("body").delegate('a[href^="/"]', "click", function () {
      History.pushState(
        {
          _: Math.random(),
        },
        "Dots",
        $(this).attr("href"),
      );
      return false;
    });

    $("#head .logo").click(function () {
      $("#prompt form input[name=addr]").focus();
    });

    $("#prompt form").submit(function () {
      var addr = $("input[name=addr]", this).val();

      if (
        !addr ||
        !addr.match(
          /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$|^((?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,5}(?::[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(?::[0-9A-Fa-f]{1,4}){1,3}|(?:[0-9A-Fa-f]{1,4}:){1,3}(?::[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(?::[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:(?::[0-9A-Fa-f]{1,4}){1,6}|:(?:(?::[0-9A-Fa-f]{1,4}){1,7}|:))$|^((?!-)[_A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/,
        )
      ) {
        $("input[name=addr]", this).focus().tooltip("show");
        return false;
      }

      addrCur = null;
      History.pushState(
        {
          _: Math.random(),
        },
        "Dots",
        "/" + addr,
      );
      return false;
    });

    $("#prompt form input[name=addr]").tooltip({
      animation: false,
      placement: "bottom",
      container: "body",
      trigger: "focus",
    });

    $(window).trigger("statechange");
  })(window, jQuery);
});
