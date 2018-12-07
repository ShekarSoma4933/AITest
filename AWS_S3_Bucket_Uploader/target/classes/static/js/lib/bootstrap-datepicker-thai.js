/**
 * Implement Thai-year handling inherit core datepicker and default bootstrap-datepicker backend.
 */

;(function($) {
  var dates   = $.fn.datepicker.dates
    , DPGlobal= $.fn.datepicker.DPGlobal
    , thai    = { 
                  adj     : 543
                , code    : 'th'
                , bound   : 0 //Jai changed Existed Value 2400 // full year value that detect as thai year 
                , shbound : 40  // short year value that detect as thai year 
                , shwrap  : 84  // short year value that wrap to previous century
                , shbase  : 2000  // default base for short year 20xx
                }
                
  function dspThaiYear(language) {
    return language.search('-'+thai.code)>=0
  }
  
  function smartThai(language){
    return language.search(thai.code)>=0
  }
  
  function smartFullYear(v,language){
    if (smartThai(language) && v>=thai.bound) 
      v -= thai.adj // thaiyear 24xx -
    
    if (dspThaiYear(language) && v < thai.bound - thai.adj) 
      v -= thai.adj
    
    return v;
  }
  
  function smartShortYear(v,language) {
    if (v<100){
      if (v>=thai.shwrap) 
        v -= 100; // 1970 - 1999
        
      if (smartThai(language) && v>=thai.shbound) 
        v -= (thai.adj%100) // thaiyear [2540..2569] -> [1997..2026]

      v += thai.shbase;
    }
    return v;
  }
  
  function smartYear(v,language) {
    return smartFullYear(smartShortYear(v,language),language)
  }
  
  function UTCDate() {
    return new Date(Date.UTC.apply(Date, arguments))
  }

  // inherit default backend
  
  if (DPGlobal.name && DPGlobal.name.search(/.th$/)>=0)
    return
    
  var  _basebackend_ = $.extend({},DPGlobal)
  
  $.extend(DPGlobal,{
      name:       (_basebackend_.name || '') + '.th'
    , parseDate:  
        function(date, format, language) {
          if (date=='') {
            date = new Date()
            date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
          }

          if (smartThai(language) 
          && !((date instanceof Date) || /^[-+].*/.test(date))) {
          
            var formats = format //this.parseFormat(format)
              , parts   = date && date.match(this.nonpunctuation) || []
            
            if (typeof formats === 'string')
              formats = DPGlobal.parseFormat(format);
            if (parts.length == formats.parts.length) {
              var seps  = $.extend([], formats.separators)
                , xdate = []
                
              for (var i=0, cnt = formats.parts.length; i < cnt; i++) {
                if (~['yyyy','yy'].indexOf(formats.parts[i]))
                  parts[i] = '' + smartYear(parseInt(parts[i], 10),language)
                  
                if (seps.length)
                  xdate.push(seps.shift())
                  
                xdate.push(parts[i])
              }
              
              date = xdate.join('')
            }
          }
          return _basebackend_.parseDate.call(this,date,format,language)
        }
    , formatDate: 
        function(date, format, language){
          var fmtdate = _basebackend_.formatDate.call(this,date,format,language)

          if (dspThaiYear(language)){
            var formats = format //this.parseFormat(format)
              , parts   = fmtdate && fmtdate.match(this.nonpunctuation) || []
              , trnfrm  = {
                  yy  : (thai.adj+date.getUTCFullYear()).toString().substring(2)
                , yyyy: (thai.adj+date.getUTCFullYear()).toString()
                }
                
            if (typeof formats === 'string')
              formats = DPGlobal.parseFormat(format);
              
            if (parts.length == formats.parts.length) {
              var seps  = $.extend([], formats.separators)
                , xdate = []
                
              for (var i=0, cnt = formats.parts.length; i < cnt; i++) {
                if (seps.length)
                  xdate.push(seps.shift())
                  
                xdate.push(trnfrm[formats.parts[i]] || parts[i])
              }
              fmtdate = xdate.join('')
            }
          
          }
          return fmtdate
        }
    })

  // inherit core datepicker
  var DatePicker = $.fn.datepicker.Constructor
  
  if (!DatePicker.prototype.fillThai){
    var _basemethod_ = $.extend({},DatePicker.prototype)
    
    $.extend(DatePicker.prototype,{
        fillThai: function(){
            var d         = new Date(this.viewDate)
              , year      = d.getUTCFullYear()
              , month     = d.getUTCMonth()
              , elem      = this.picker.find('.datepicker-days th:eq(1)')
             /* 
              * AA01171 added for SIT Issue No.16
              * for checking startyear and endyear to set class active for year  */
              startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
              endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity;
              var currentYear = this.date && this.date.getUTCFullYear();
             
            elem
              .text(elem.text()
              .replace(''+year,''+(year+(thai.adj))))

            this.picker
              .find('.datepicker-months')
              .find('th:eq(1)')
              .text(''+(year+(thai.adj)))
            
            //For recreating .datepicker-years class with thai valus (AA01171 added)
            html = '';
			year = parseInt((year + thai.adj)/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year'+(i == -1 ? ' old' : i == 10 ? ' new' : '')+((currentYear+thai.adj) == year ? ' active' : '')+(year < (startYear+thai.adj) || year > (endYear+thai.adj) ? ' disabled' : '')+'">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
          }
      , fill: function(){
            _basemethod_.fill.call(this)
            
            if (dspThaiYear(this.o.language))
              this.fillThai()
          }
      , clickThai: function(e){
            var target  = $(e.target).closest('span')
// If disabled field is clicked so thai adjustment is no need to perform
// changes done by AA01171
            if (target.length === 1 && target.is('.year')){
            	if(target.is('.disabled')){
            		target.text(Number(target.text()))	
            	}else{
            		target.text(Number(target.text()) - thai.adj)
            	}
            }
          }
      , click: function(e){
            if (dspThaiYear(this.o.language))
              this.clickThai(e)
              
            _basemethod_.click.call(this,e)
          }
      , keydown: function(e){
            // allow arrow-down to show picker
            if (this.picker.is(':not(:visible)')
            && e.keyCode == 40 // arrow-down
            && $(e.target).is('[autocomplete="off"]')) {
                  this.show()
                  return;
            }
            _basemethod_.keydown.call(this,e)
          }
      , hide: function(e){
            // fix redundant hide in orginal code
            if (this.picker.is(':visible'))
              _basemethod_.hide.call(this,e)
            //else console.log('redundant hide')
          }
      
    })
  }
}(jQuery));