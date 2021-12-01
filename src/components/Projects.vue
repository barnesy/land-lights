<template>
  <PageSection class="narrow" bgColor="var(--light-grey)" align="center">
    <template #title>
      What We're Working On...
      </template>
    <template>
      <CardGroup>
        <Card url="/gas-generators/" labelColor="var(--light-blue)">
          <template #image>
            <g-image src="~/assets/img/generac.jpg"/>
            </template>
          <template #label>
            Projects
          </template>
          <template #title>
            Gas Generators
            </template>
          <template>
            Backup generators run on natural gas and turn on automatically
            when an electrical outage occurs to restore power to a customer's
            home.
          </template>
          <template #link>
            Gas Generators
          </template>
        </Card>
        <Card url="/framework/" labelColor="var(--light-blue)">
          <template #image>
            <g-image src="~/assets/img/builders.jpg"/>
          </template>
          <template #label>
            Projects
          </template>
          <template #title>
            Our Approach
          </template>
          <template>
            The goal is to cycle through the process as efficiently as
            possible, because each time the product improves.
          </template>
          <template #link>
            Our Approach
          </template>
        </Card>
      </CardGroup>
    </template>
  </PageSection>
</template>