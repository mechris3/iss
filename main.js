;(function () {
  class D3Map {
    constructor(topology) {
      this.svg = d3.select('body').append('svg').attr('id', 'map')
      const { height, width } = document
        .getElementById('map')
        .getBoundingClientRect()
      const geojson = topojson.feature(topology, topology.objects['world.geo'])
      this.countries = geojson.features
      this.projection = d3.geoMercator()
      this.projection.fitExtent(
        [
          [0, 0],
          [width, height],
        ],
        geojson,
      )
    }

    drawCountries() {
      const path = d3.geoPath().projection(this.projection)

      const countryGroup = this.svg
        .append('g')
        .selectAll('path')
        .data(this.countries)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'lightgray')
        .attr('stroke', 'white')

      return countryGroup
    }

    getIss() {
      d3.json('https://api.wheretheiss.at/v1/satellites/25544').then(
        (issPosition) => {
          this.drawISS(issPosition)
        },
      )
    }

    drawISS(position) {
      const ISSGroup = this.svg.append('g')
      ISSGroup.selectAll('image')
        .data([position])
        .enter()
        .append('image')
        .attr('href', 'iss.svg')
        .attr('width', '15px')
        .attr('height', '15px')
        .attr('x', (iss) => this.projection([iss.longitude, iss.latitude])[0])
        .attr('y', (iss) => this.projection([iss.longitude, iss.latitude])[1])
    }
  }
  d3.json('world.topo.json').then((topology) => {
    const map = new D3Map(topology)
    map.drawCountries()
    map.getIss()
    setInterval(() => map.getIss(), 10000)
  })
})()
