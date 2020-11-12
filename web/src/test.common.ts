import { Component, Type } from '@angular/core';
import {
  MetadataOverride,
  TestBed,
  TestModuleMetadata,
  waitForAsync,
} from '@angular/core/testing';

const resetTestingModule = TestBed.resetTestingModule,
  preventAngularFromResetting = () =>
    (TestBed.resetTestingModule = () => TestBed);

export const setUpTestBed = (
  moduleDef: TestModuleMetadata,
  componentOverride?: ComponentOverride
) => {
  beforeAll(
    waitForAsync(async () => {
      resetTestingModule();
      preventAngularFromResetting();
      TestBed.configureTestingModule(moduleDef);
      if (componentOverride) {
        TestBed.overrideComponent(
          componentOverride.component,
          componentOverride.override
        );
      }
      await TestBed.compileComponents();
    })
  );

  afterAll(() => resetTestingModule());
};

interface ComponentOverride {
  component: Type<any>;
  override: MetadataOverride<Component>;
}
