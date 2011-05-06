var Template = function(template, profile) {
	var self = this,
	k, i, l;
	self.Resources = {};
	self.meta = {
		warnings: []
	};

	function merge(obj, data) {
		for (var prop in data) {
			if (data.hasOwnProperty(prop)) {
				if (data[prop]) {
					if (!obj.hasOwnProperty(prop)) {
						self.meta.warnings.push('Profile does not have property ' + prop + ' for object ' + obj.toString());
					}
					obj[prop] = data[prop];
				}
			}
		}
		return obj;
	}

	function cleanup(obj) {
		for (var k in obj) {
			if (obj[k].unused) {
				delete obj[k];
			}
		}
		return obj;
	};

	function create(name, data) {
		var a = data.Type.split('::'),
		objConstructor = profile[a[0]],
		obj,
		k,
		i;
		for (i = 1; i < a.length; i++) {
			objConstructor = objConstructor[a[i]];
		}
		obj = merge(new objConstructor(name, data.Type), data.Properties);
		cleanup(obj);
		for (i = 0; i < obj.meta.required.length; i++) {
			if (!obj[obj.meta.required[i]]) {
				self.meta.warnings.push('Requied property ' + obj.meta.required[i] + ' is not set in ' + obj.toString());
			}
		}
		return obj;
	}

	function findRef(ref) {
		var k;
		for (k in self.Parameters) {
			if (k === ref) {
				return self.Parameters[k]
			}
		}
		for (k in self.Resources) {
			if (k === ref) {
				return self.Resources[k];
			}
		}
		return null;
	}

	function appendMeta(col) {
		for (var k in col) {
			col[k].meta = col[k].meta ? col[k].meta: {};
		}
	}

	function removeAllMeta(obj) {
		if (typeof obj === 'object') {
			delete obj['meta'];
			for (var p in obj) {
				removeAllMeta(obj[p]);
			}
		}
	}

	self.AWSTemplateFormatVersion = template.AWSTemplateFormatVersion;
	self.Description = template.Description;
	self.Parameters = template.Parameters;
	self.Mappings = template.Mappings;
    self.Outputs = template.Outputs;
	appendMeta(self.Parameters);
	appendMeta(self.Mappings);

	for (k in template.Resources) {
		self.Resources[k] = create(k, template.Resources[k]);
	}
	for (k in self.Resources) {
		for (l in self.Resources[k]) {
			if (self.Resources[k][l].constructor === Object) {
				var ref = self.Resources[k][l]['Ref'];
				if (ref) {
					self.Resources[k][l] = new Ref(findRef(ref));
				}
			} else if (self.Resources[k][l].constructor === Array) {
				for (i = 0; i < self.Resources[k][l].length; i++) {
					var ref = self.Resources[k][l][i]['Ref'];
					if (ref) {
						self.Resources[k][l][i] = new Ref(findRef(ref));
					}
				}
			}
		}
	}

	this.toTemplate = function() {
		removeAllMeta(self.Parameters);
		removeAllMeta(self.Mappings);
		var t = {
			AWSTemplateFormatVersion: self.AWSTemplateFormatVersion,
			Descriptoin: self.Description,
			Parameters: self.Parameters,
			Mappings: self.Mappings
            Outputs: self.Outputs
		};
		return t;
	};

	return self;
};

var Ref = function(ref) {
	this.ref = ref;
};

if (typeof module !== 'undefined' && module.exports) {
	exports.Template = Template;
}

